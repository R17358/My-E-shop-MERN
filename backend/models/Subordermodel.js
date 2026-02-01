const mongoose = require("mongoose");

/**
 * SubOrder Schema
 * Each SubOrder represents products from ONE seller within a main Order
 * When customer buys from 2 sellers, 1 Order → 2 SubOrders
 */
const subOrderSchema = new mongoose.Schema({
  // Reference to main order
  mainOrder: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    required: true,
  },
  
  // Seller who will fulfill this suborder
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Customer who placed the order
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Same shipping info from main order
  shippingInfo: {
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: Number,
    phoneNo: Number,
  },
  
  // Products from THIS seller only
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: String,
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  
  // Financial breakdown for THIS seller's products
  itemsPrice: {
    type: Number,
    required: true,
  },
  
  taxPrice: {
    type: Number,
    required: true,
  },
  
  shippingPrice: {
    type: Number,
    required: true,
  },
  
  // Platform commission
  platformCommission: {
    type: Number,
    required: true,
    default: 0,
  },
  
  // What seller will actually receive (after commission)
  sellerEarnings: {
    type: Number,
    required: true,
  },
  
  // Total for this suborder
  totalPrice: {
    type: Number,
    required: true,
  },
  
  // Payment status for this seller
  paymentStatus: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Failed"],
    default: "Pending",
  },
  
  // When seller was paid
  sellerPaidAt: Date,
  
  // Order status (each seller manages their own suborder)
  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  
  shippedAt: Date,
  deliveredAt: Date,
  
  // Tracking details
  trackingInfo: {
    trackingId: String,
    courier: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster seller queries
subOrderSchema.index({ seller: 1, createdAt: -1 });
subOrderSchema.index({ mainOrder: 1 });

module.exports = mongoose.model("SubOrder", subOrderSchema);
