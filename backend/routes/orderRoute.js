const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  getAllSubOrders,
  updateSellerSubOrder,
  deleteOrder,
  getSellerOrders,
  getSellerSubOrder,
  processSellerPayment,
} = require("../controllers/orderController");

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Customer routes
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// Seller routes
router.route("/seller/orders").get(
  isAuthenticatedUser,
  authorizeRoles("seller", "admin"),
  getSellerOrders
);

router.route("/seller/order/:id").get(
  isAuthenticatedUser,
  authorizeRoles("seller", "admin"),
  getSellerSubOrder
);

router.route("/seller/order/:id").put(
  isAuthenticatedUser,
  authorizeRoles("seller", "admin"),
  updateSellerSubOrder
);

// Admin routes
router.route("/admin/orders").get(
  isAuthenticatedUser,
  authorizeRoles("admin", "seller"),
  getAllOrders
);

router.route("/admin/suborders").get(
  isAuthenticatedUser,
  authorizeRoles("admin", "seller"),
  getAllSubOrders
);

router.route("/admin/order/:id").delete(
  isAuthenticatedUser,
  authorizeRoles("admin", "seller"),
  deleteOrder
);

router.route("/admin/suborder/:id/pay").put(
  isAuthenticatedUser,
  authorizeRoles("admin", "seller"),
  processSellerPayment
);

module.exports = router;
