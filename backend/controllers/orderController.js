const Order = require("../models/orderModel");
const SubOrder = require("../models/Subordermodel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

/**
 * Create new Order — with automatic seller splitting
 *
 * Pricing rules (must match ConfirmOrder.js frontend exactly):
 *   shippingPrice = sum of product.shippingCharges per ITEM  (one charge per item)
 *   taxPrice      = sum of ((itemPrice + itemShipping) * gstPercent/100) per ITEM
 *   totalPrice    = itemsPrice + shippingPrice + taxPrice
 */
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo } = req.body;

  // ── Step 1: Fetch products, calculate prices, group by seller ──────────────
  const sellerGroups = {};
  let totalItemsPrice = 0;
  let totalTaxPrice = 0;
  let totalShippingPrice = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new ErrorHander(`Product not found: ${item.product}`, 404));
    }

    // Per-item calculations — identical formula to ConfirmOrder.js
    const itemPrice    = product.price * item.quantity;
    const itemShipping = product.shippingCharges ?? 50;          // per item, not max
    const gstRate      = (product.gstPercent ?? 18) / 100;
    const itemTax      = (itemPrice + itemShipping) * gstRate;   // GST on price + shipping

    totalItemsPrice   += itemPrice;
    totalShippingPrice += itemShipping;
    totalTaxPrice     += itemTax;

    // ── Group by seller ──
    const sellerId = product.seller.toString();

    if (!sellerGroups[sellerId]) {
      sellerGroups[sellerId] = {
        seller: product.seller,
        items: [],
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        platformCommission: 0,
      };
    }

    sellerGroups[sellerId].items.push({
      name:     product.name,
      price:    product.price,
      quantity: item.quantity,
      image:    product.images[0]?.url || "",
      product:  product._id,
    });

    sellerGroups[sellerId].itemsPrice    += itemPrice;
    sellerGroups[sellerId].shippingPrice += itemShipping;
    sellerGroups[sellerId].taxPrice      += itemTax;

    // Platform commission — on product price only (before tax/shipping)
    const commissionRate = product.platformCommissionPercent ?? 10;
    sellerGroups[sellerId].platformCommission +=
      (itemPrice * commissionRate) / 100;
  }

  const totalPrice = totalItemsPrice + totalShippingPrice + totalTaxPrice;

  // ── Step 2: Create main order ──────────────────────────────────────────────
  const order = await Order.create({
    shippingInfo,
    orderItems: orderItems.map((item) => ({ ...item })),
    paymentInfo,
    itemsPrice:    totalItemsPrice,
    taxPrice:      totalTaxPrice,
    shippingPrice: totalShippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  // ── Step 3: Create one SubOrder per seller ─────────────────────────────────
  const subOrders = [];

  for (const sellerId in sellerGroups) {
    const g = sellerGroups[sellerId];

    const subOrderTotal = g.itemsPrice + g.shippingPrice + g.taxPrice;

    // Seller earns everything except platform commission
    const sellerEarnings = subOrderTotal - g.platformCommission;

    const subOrder = await SubOrder.create({
      mainOrder:          order._id,
      seller:             sellerId,
      customer:           req.user._id,
      shippingInfo,
      orderItems:         g.items,
      itemsPrice:         g.itemsPrice,
      taxPrice:           g.taxPrice,
      shippingPrice:      g.shippingPrice,
      platformCommission: g.platformCommission,
      sellerEarnings,
      totalPrice:         subOrderTotal,
      paymentStatus:      paymentInfo.status || "Pending",
    });

    subOrders.push(subOrder);
  }

  res.status(201).json({
    success: true,
    order,
    subOrders,
    message: `Order created with ${subOrders.length} seller(s)`,
  });
});

// ── Get Single Order (customer view) ──────────────────────────────────────────
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  const subOrders = await SubOrder.find({ mainOrder: order._id }).populate(
    "seller",
    "name email"
  );

  res.status(200).json({ success: true, order, subOrders });
});

// ── My Orders (customer) ──────────────────────────────────────────────────────
exports.myOrders = catchAsyncErrors(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  const ordersWithSubs = await Promise.all(
    orders.map(async (order) => {
      const subOrders = await SubOrder.find({ mainOrder: order._id }).populate(
        "seller",
        "name email"
      );
      return { ...order.toObject(), subOrders };
    })
  );

  res.status(200).json({ success: true, orders: ordersWithSubs });
});

// ── Get Seller's SubOrders ────────────────────────────────────────────────────
exports.getSellerOrders = catchAsyncErrors(async (req, res, next) => {
  const subOrders = await SubOrder.find({ seller: req.user._id })
    .populate("customer", "name email")
    .populate("mainOrder", "createdAt orderStatus")
    .sort({ createdAt: -1 });

  let totalEarnings = 0;
  let pendingEarnings = 0;

  subOrders.forEach((sub) => {
    if (sub.paymentStatus === "Completed") {
      totalEarnings += sub.sellerEarnings;
    } else {
      pendingEarnings += sub.sellerEarnings;
    }
  });

  res.status(200).json({
    success: true,
    subOrders,
    totalEarnings,
    pendingEarnings,
    orderCount: subOrders.length,
  });
});

// ── Get Single SubOrder (seller view) ────────────────────────────────────────
exports.getSellerSubOrder = catchAsyncErrors(async (req, res, next) => {
  const subOrder = await SubOrder.findById(req.params.id)
    .populate("customer", "name email phoneNo")
    .populate("mainOrder")
    .populate("orderItems.product");

  if (!subOrder) {
    return next(new ErrorHander("Order not found", 404));
  }

  if (subOrder.seller.toString() !== req.user._id.toString()) {
    return next(new ErrorHander("Not authorized to view this order", 403));
  }

  res.status(200).json({ success: true, subOrder });
});

// ── Update SubOrder Status (seller) ──────────────────────────────────────────
exports.updateSellerSubOrder = catchAsyncErrors(async (req, res, next) => {
  const subOrder = await SubOrder.findById(req.params.id).populate("mainOrder");

  if (!subOrder) {
    return next(new ErrorHander("Order not found", 404));
  }

  if (subOrder.seller.toString() !== req.user._id.toString()) {
    return next(new ErrorHander("Not authorized to update this order", 403));
  }

  if (subOrder.orderStatus === "Delivered") {
    return next(new ErrorHander("Order already delivered", 400));
  }

  // Deduct stock when shipping
  if (req.body.status === "Shipped" && subOrder.orderStatus !== "Shipped") {
    for (const item of subOrder.orderItems) {
      await updateStock(item.product, item.quantity);
    }
    subOrder.shippedAt = Date.now();
  }

  subOrder.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    subOrder.deliveredAt = Date.now();
  }

  if (req.body.trackingInfo) {
    subOrder.trackingInfo = req.body.trackingInfo;
  }

  await subOrder.save({ validateBeforeSave: false });

  // ── Sync main order status based on all suborders ──
  const allSubOrders = await SubOrder.find({ mainOrder: subOrder.mainOrder._id });

  const allDelivered = allSubOrders.every((s) => s.orderStatus === "Delivered");
  const allShippedOrDelivered = allSubOrders.every(
    (s) => s.orderStatus === "Shipped" || s.orderStatus === "Delivered"
  );
  const anyShippedOrDelivered = allSubOrders.some(
    (s) => s.orderStatus === "Shipped" || s.orderStatus === "Delivered"
  );

  let newMainOrderStatus = "Processing";
  if (allDelivered)            newMainOrderStatus = "Delivered";
  else if (allShippedOrDelivered) newMainOrderStatus = "Shipped";
  else if (anyShippedOrDelivered) newMainOrderStatus = "Shipped"; // partial

  const mainOrder = await Order.findById(subOrder.mainOrder._id);
  mainOrder.orderStatus = newMainOrderStatus;

  if (newMainOrderStatus === "Delivered" && !mainOrder.deliveredAt) {
    mainOrder.deliveredAt = Date.now();
  }

  await mainOrder.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, subOrder });
});

// ── Admin: Get All Orders ─────────────────────────────────────────────────────
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => { totalAmount += order.totalPrice; });

  const subOrders = await SubOrder.find();
  let platformEarnings = 0;
  subOrders.forEach((sub) => { platformEarnings += sub.platformCommission; });

  res.status(200).json({ success: true, totalAmount, platformEarnings, orders });
});

// ── Admin: Get All SubOrders ──────────────────────────────────────────────────
exports.getAllSubOrders = catchAsyncErrors(async (req, res, next) => {
  const subOrders = await SubOrder.find()
    .populate("seller", "name email")
    .populate("customer", "name email")
    .sort({ createdAt: -1 });

  let totalPlatformCommission = 0;
  let totalSellerEarnings = 0;

  subOrders.forEach((sub) => {
    totalPlatformCommission += sub.platformCommission;
    totalSellerEarnings     += sub.sellerEarnings;
  });

  res.status(200).json({
    success: true,
    subOrders,
    totalPlatformCommission,
    totalSellerEarnings,
  });
});

// ── Admin: Process Seller Payment ─────────────────────────────────────────────
exports.processSellerPayment = catchAsyncErrors(async (req, res, next) => {
  const subOrder = await SubOrder.findById(req.params.id);

  if (!subOrder) {
    return next(new ErrorHander("SubOrder not found", 404));
  }

  if (subOrder.paymentStatus === "Completed") {
    return next(new ErrorHander("Seller already paid for this order", 400));
  }

  subOrder.paymentStatus = "Completed";
  subOrder.sellerPaidAt  = Date.now();

  await subOrder.save();

  res.status(200).json({
    success: true,
    message: `₹${subOrder.sellerEarnings} marked as paid to seller`,
    subOrder,
  });
});

// ── Admin: Delete Order ───────────────────────────────────────────────────────
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await SubOrder.deleteMany({ mainOrder: order._id });
  await order.remove();

  res.status(200).json({ success: true });
});

// ── Helper ────────────────────────────────────────────────────────────────────
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}