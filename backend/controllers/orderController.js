const Order = require("../models/orderModel");
const SubOrder = require("../models/subOrderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

/**
 * Create new Order - WITH AUTOMATIC SELLER SPLITTING
 * This is the magic function that solves your problem
 */
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
  } = req.body;


  // Step 1: Calculate prices and group by seller
  const sellerGroups = {};
  let totalItemsPrice = 0;
  let totalTaxPrice = 0;
  let totalShippingPrice = 0;

  // Fetch all products to get seller info and pricing details
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return next(new ErrorHander(`Product not found: ${item.product}`, 404));
    }

    // Calculate prices for this item
    const itemPrice = product.price * item.quantity;
    const itemShipping = product.shippingCharges || 50;
    const itemTax = ((itemPrice + itemShipping) * product.gstPercent) / 100;
    
    totalItemsPrice += itemPrice;
    totalShippingPrice += itemShipping;
    totalTaxPrice += itemTax;

    // Group by seller
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

    // Add item to seller's group
    sellerGroups[sellerId].items.push({
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0]?.url || "",
      product: product._id,
    });

    sellerGroups[sellerId].itemsPrice += itemPrice;
    sellerGroups[sellerId].shippingPrice += itemShipping;
    sellerGroups[sellerId].taxPrice += itemTax;
    
    // Calculate platform commission for this seller
    const commissionRate = product.platformCommissionPercent || 10;
    sellerGroups[sellerId].platformCommission += (itemPrice * commissionRate) / 100;
  }

  const totalPrice = totalItemsPrice + totalShippingPrice + totalTaxPrice;

  // Step 2: Create main order
  const order = await Order.create({
    shippingInfo,
    orderItems: orderItems.map(item => ({
      ...item,
      seller: item.seller, // Make sure seller is included
    })),
    paymentInfo,
    itemsPrice: totalItemsPrice,
    taxPrice: totalTaxPrice,
    shippingPrice: totalShippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  // Step 3: Create SubOrders for each seller
  const subOrders = [];
  
  for (const sellerId in sellerGroups) {
    const sellerData = sellerGroups[sellerId];
    
    const subOrderTotal = 
      sellerData.itemsPrice + 
      sellerData.shippingPrice + 
      sellerData.taxPrice;
    
    const sellerEarnings = 
      sellerData.itemsPrice + 
      sellerData.shippingPrice + 
      sellerData.taxPrice - 
      sellerData.platformCommission;

    const subOrder = await SubOrder.create({
      mainOrder: order._id,
      seller: sellerId,
      customer: req.user._id,
      shippingInfo,
      orderItems: sellerData.items,
      itemsPrice: sellerData.itemsPrice,
      taxPrice: sellerData.taxPrice,
      shippingPrice: sellerData.shippingPrice,
      platformCommission: sellerData.platformCommission,
      sellerEarnings,
      totalPrice: subOrderTotal,
      paymentStatus: "Pending",
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

// Get Single Order (customer view)
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  // Get all suborders for this main order
  const subOrders = await SubOrder.find({ mainOrder: order._id })
    .populate("seller", "name email");

  res.status(200).json({
    success: true,
    order,
    subOrders, // Show customer how their order is split
  });
});

// Get logged in user Orders (customer)
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// ===== SELLER-SPECIFIC ENDPOINTS =====

/**
 * Get Seller's Orders
 * This shows only orders containing products from THIS seller
 */
exports.getSellerOrders = catchAsyncErrors(async (req, res, next) => {
  // Find all suborders where this user is the seller
  const subOrders = await SubOrder.find({ seller: req.user._id })
    .populate("customer", "name email")
    .populate("mainOrder", "createdAt orderStatus")
    .sort({ createdAt: -1 });

  // Calculate total earnings
  let totalEarnings = 0;
  let pendingEarnings = 0;
  
  subOrders.forEach(subOrder => {
    if (subOrder.paymentStatus === "Completed") {
      totalEarnings += subOrder.sellerEarnings;
    } else {
      pendingEarnings += subOrder.sellerEarnings;
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

/**
 * Get Single SubOrder (seller view)
 */
exports.getSellerSubOrder = catchAsyncErrors(async (req, res, next) => {
  const subOrder = await SubOrder.findById(req.params.id)
    .populate("customer", "name email phoneNo")
    .populate("mainOrder")
    .populate("orderItems.product");

  if (!subOrder) {
    return next(new ErrorHander("Order not found", 404));
  }

  // Ensure this seller owns this suborder
  if (subOrder.seller.toString() !== req.user._id.toString()) {
    return next(new ErrorHander("Not authorized to view this order", 403));
  }

  res.status(200).json({
    success: true,
    subOrder,
  });
});

/**
 * Update SubOrder Status (seller)
 * Seller can update their own suborder status
 */
exports.updateSellerSubOrder = catchAsyncErrors(async (req, res, next) => {
  const subOrder = await SubOrder.findById(req.params.id);

  if (!subOrder) {
    return next(new ErrorHander("Order not found", 404));
  }

  // Ensure this seller owns this suborder
  if (subOrder.seller.toString() !== req.user._id.toString()) {
    return next(new ErrorHander("Not authorized to update this order", 403));
  }

  if (subOrder.orderStatus === "Delivered") {
    return next(new ErrorHander("Order already delivered", 400));
  }

  // Update stock when shipping
  if (req.body.status === "Shipped" && subOrder.orderStatus !== "Shipped") {
    for (const item of subOrder.orderItems) {
      await updateStock(item.product, item.quantity);
    }
    subOrder.shippedAt = Date.now();
  }

  // Update status
  subOrder.orderStatus = req.body.status;
  
  if (req.body.status === "Delivered") {
    subOrder.deliveredAt = Date.now();
  }

  // Add tracking info if provided
  if (req.body.trackingInfo) {
    subOrder.trackingInfo = req.body.trackingInfo;
  }

  await subOrder.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    subOrder,
  });
});

// ===== ADMIN ENDPOINTS =====

/**
 * Get All Orders (Admin)
 */
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  // Get platform earnings from all suborders
  const subOrders = await SubOrder.find();
  let platformEarnings = 0;
  
  subOrders.forEach(subOrder => {
    platformEarnings += subOrder.platformCommission;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    platformEarnings,
    orders,
  });
});

/**
 * Get All SubOrders (Admin)
 */
exports.getAllSubOrders = catchAsyncErrors(async (req, res, next) => {
  const subOrders = await SubOrder.find()
    .populate("seller", "name email")
    .populate("customer", "name email")
    .sort({ createdAt: -1 });

  let totalPlatformCommission = 0;
  let totalSellerEarnings = 0;

  subOrders.forEach(subOrder => {
    totalPlatformCommission += subOrder.platformCommission;
    totalSellerEarnings += subOrder.sellerEarnings;
  });

  res.status(200).json({
    success: true,
    subOrders,
    totalPlatformCommission,
    totalSellerEarnings,
  });
});

/**
 * Process Seller Payment (Admin)
 * Mark seller as paid for a specific suborder
 */
exports.processSellerPayment = catchAsyncErrors(async (req, res, next) => {
  const subOrder = await SubOrder.findById(req.params.id);

  if (!subOrder) {
    return next(new ErrorHander("SubOrder not found", 404));
  }

  if (subOrder.paymentStatus === "Completed") {
    return next(new ErrorHander("Seller already paid for this order", 400));
  }

  subOrder.paymentStatus = "Completed";
  subOrder.sellerPaidAt = Date.now();

  await subOrder.save();

  res.status(200).json({
    success: true,
    message: `₹${subOrder.sellerEarnings} marked as paid to seller`,
    subOrder,
  });
});

// Helper function
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete Order (Admin)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  // Also delete associated suborders
  await SubOrder.deleteMany({ mainOrder: order._id });

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
