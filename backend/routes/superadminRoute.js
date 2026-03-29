const express = require("express");
const {
  getSuperAdminDashboard,
  getAllCommissions,
  getSellerCommissions,
  updateCommissionRate,
  markSellerPaid,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  deleteOrder,
  getAllSellers,
} = require("../controllers/superadminController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

const superadmin = [isAuthenticatedUser, authorizeRoles("superadmin")];

// Dashboard
router.route("/superadmin/dashboard").get(...superadmin, getSuperAdminDashboard);

// Commissions
router.route("/superadmin/commissions").get(...superadmin, getAllCommissions);
router.route("/superadmin/commissions/seller/:id").get(...superadmin, getSellerCommissions);
router.route("/superadmin/commission/product/:id").put(...superadmin, updateCommissionRate);
router.route("/superadmin/commission/pay/:id").put(...superadmin, markSellerPaid);

// Users
router.route("/superadmin/users").get(...superadmin, getAllUsers);
router.route("/superadmin/user/:id")
  .get(...superadmin, getSingleUser)
  .put(...superadmin, updateUserRole)
  .delete(...superadmin, deleteUser);

// Sellers
router.route("/superadmin/sellers").get(...superadmin, getAllSellers);

// Products
router.route("/superadmin/products").get(...superadmin, getAllProducts);
router.route("/superadmin/product/:id").delete(...superadmin, deleteProduct);
router.route("/superadmin/product/commission/:id").put(...superadmin, updateCommissionRate);

// Orders
router.route("/superadmin/orders").get(...superadmin, getAllOrders);
router.route("/superadmin/order/:id").delete(...superadmin, deleteOrder);

module.exports = router;
