const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const SubOrder = require("../models/Subordermodel");

// ── Dashboard Overview ────────────────────────────────────────────────────────
exports.getSuperAdminDashboard = catchAsyncErrors(async (req, res, next) => {
  const totalUsers    = await User.countDocuments();
  const totalSellers  = await User.countDocuments({ role: "seller" });
  const totalAdmins   = await User.countDocuments({ role: "admin" });
  const totalCustomers = await User.countDocuments({ role: "user" });

  const totalProducts = await Product.countDocuments();
  const totalOrders   = await Order.countDocuments();

  const subOrders = await SubOrder.find();
  let totalRevenue = 0;
  let totalCommissions = 0;
  let pendingCommissions = 0;
  let paidCommissions = 0;

  subOrders.forEach((sub) => {
    totalRevenue     += sub.totalPrice;
    totalCommissions += sub.platformCommission;
    if (sub.paymentStatus === "Completed") {
      paidCommissions += sub.platformCommission;
    } else {
      pendingCommissions += sub.platformCommission;
    }
  });

  // Monthly revenue last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const monthlyData = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        orders:  { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Monthly commissions last 6 months
  const monthlyCommissions = await SubOrder.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        commission: { $sum: "$platformCommission" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalSellers,
      totalAdmins,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCommissions,
      pendingCommissions,
      paidCommissions,
    },
    monthlyData,
    monthlyCommissions,
    recentOrders,
  });
});

// ── Commissions ───────────────────────────────────────────────────────────────
exports.getAllCommissions = catchAsyncErrors(async (req, res, next) => {
  const subOrders = await SubOrder.find()
    .populate("seller", "name email")
    .populate("customer", "name email")
    .populate("mainOrder", "createdAt totalPrice")
    .sort({ createdAt: -1 });

  let totalCommissions = 0;
  let paidCommissions  = 0;
  let pendingCommissions = 0;

  subOrders.forEach((sub) => {
    totalCommissions += sub.platformCommission;
    if (sub.paymentStatus === "Completed") {
      paidCommissions += sub.platformCommission;
    } else {
      pendingCommissions += sub.platformCommission;
    }
  });

  res.status(200).json({
    success: true,
    subOrders,
    totalCommissions,
    paidCommissions,
    pendingCommissions,
  });
});

// ── Commission per Seller ─────────────────────────────────────────────────────
exports.getSellerCommissions = catchAsyncErrors(async (req, res, next) => {
  const sellerId = req.params.id;

  const seller = await User.findById(sellerId);
  if (!seller) return next(new ErrorHander("Seller not found", 404));

  const subOrders = await SubOrder.find({ seller: sellerId })
    .populate("customer", "name email")
    .populate("mainOrder", "createdAt totalPrice")
    .sort({ createdAt: -1 });

  let totalCommissions = 0;
  let totalSellerEarnings = 0;
  let paidCommissions = 0;
  let pendingCommissions = 0;

  subOrders.forEach((sub) => {
    totalCommissions    += sub.platformCommission;
    totalSellerEarnings += sub.sellerEarnings;
    if (sub.paymentStatus === "Completed") {
      paidCommissions += sub.platformCommission;
    } else {
      pendingCommissions += sub.platformCommission;
    }
  });

  res.status(200).json({
    success: true,
    seller,
    subOrders,
    totalCommissions,
    totalSellerEarnings,
    paidCommissions,
    pendingCommissions,
  });
});

// ── Update Commission Rate on Product ────────────────────────────────────────
exports.updateCommissionRate = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHander("Product not found", 404));

  const { platformCommissionPercent } = req.body;
  if (platformCommissionPercent === undefined) {
    return next(new ErrorHander("Please provide platformCommissionPercent", 400));
  }

  product.platformCommissionPercent = platformCommissionPercent;
  await product.save();

  res.status(200).json({ success: true, product });
});

// ── Mark Seller Payment ───────────────────────────────────────────────────────
exports.markSellerPaid = catchAsyncErrors(async (req, res, next) => {
  const subOrder = await SubOrder.findById(req.params.id);
  if (!subOrder) return next(new ErrorHander("SubOrder not found", 404));

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

// ── All Users Management ──────────────────────────────────────────────────────
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, users });
});

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHander(`User not found: ${req.params.id}`, 404));
  res.status(200).json({ success: true, user });
});

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role } = req.body;

  // Prevent changing another superadmin's role unless you are superadmin
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) return next(new ErrorHander("User not found", 404));

  if (targetUser.role === "superadmin" && req.user._id.toString() !== req.params.id) {
    return next(new ErrorHander("Cannot change another superadmin's role", 403));
  }

  const updatedData = {};
  if (name)  updatedData.name  = name;
  if (email) updatedData.email = email;
  if (role)  updatedData.role  = role;

  await User.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHander(`User not found: ${req.params.id}`, 400));

  if (user.role === "superadmin") {
    return next(new ErrorHander("Cannot delete a superadmin account", 403));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: "User Deleted Successfully" });
});

// ── All Products Management ───────────────────────────────────────────────────
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find()
    .populate("seller", "name email")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, products });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHander("Product not found", 404));

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: "Product Deleted" });
});

// ── All Orders Management ─────────────────────────────────────────────────────
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  let totalRevenue = 0;
  orders.forEach((o) => { totalRevenue += o.totalPrice; });

  res.status(200).json({ success: true, orders, totalRevenue });
});

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHander("Order not found", 404));

  await SubOrder.deleteMany({ mainOrder: order._id });
  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: "Order Deleted" });
});

// ── Sellers List with Earnings ────────────────────────────────────────────────
exports.getAllSellers = catchAsyncErrors(async (req, res, next) => {
  const sellers = await User.find({ role: { $in: ["seller", "admin"] } }).sort({ createdAt: -1 });

  const sellersWithStats = await Promise.all(
    sellers.map(async (seller) => {
      const subOrders = await SubOrder.find({ seller: seller._id });
      let totalEarnings = 0;
      let totalCommission = 0;
      let productCount = await Product.countDocuments({ seller: seller._id });

      subOrders.forEach((sub) => {
        totalEarnings    += sub.sellerEarnings;
        totalCommission  += sub.platformCommission;
      });

      return {
        ...seller.toObject(),
        totalEarnings,
        totalCommission,
        orderCount: subOrders.length,
        productCount,
      };
    })
  );

  res.status(200).json({ success: true, sellers: sellersWithStats });
});
