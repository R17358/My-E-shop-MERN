// const express = require("express");
// const {
//   processPayment,
//   sendStripeApiKey,
// } = require("../controllers/paymentController");
// const router = express.Router();
// const { isAuthenticatedUser } = require("../middleware/auth");

// router.route("/payment/process").post(isAuthenticatedUser, processPayment);

// router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

// module.exports = router;

const express = require("express");
const {
  processPayment,
  verifyPayment,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");

// Create Razorpay order
router.route("/payment/process").post(isAuthenticatedUser, processPayment);

// Verify payment signature after success
router.route("/payment/verify").post(isAuthenticatedUser, verifyPayment);

module.exports = router;
