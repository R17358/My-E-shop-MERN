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
  authorizeRoles("seller"),
  getSellerOrders
);

router.route("/seller/order/:id").get(
  isAuthenticatedUser,
  authorizeRoles("seller"),
  getSellerSubOrder
);

router.route("/seller/order/:id").put(
  isAuthenticatedUser,
  authorizeRoles("seller"),
  updateSellerSubOrder
);

// Admin routes
router.route("/admin/orders").get(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllOrders
);

router.route("/admin/suborders").get(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllSubOrders
);

router.route("/admin/order/:id").delete(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteOrder
);

router.route("/admin/suborder/:id/pay").put(
  isAuthenticatedUser,
  authorizeRoles("admin"),
  processSellerPayment
);

module.exports = router;
