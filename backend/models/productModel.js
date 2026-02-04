const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  
  // NEW FIELDS FOR MULTI-VENDOR
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Platform commission percentage (you can set platform-wide or per product)
  platformCommissionPercent: {
    type: Number,
    default: 10, // 10% platform commission
    min: 0,
    max: 100,
  },
  
  // Shipping charges (can be per product or calculated later)
  shippingCharges: {
    type: Number,
    default: 50, // ₹50 default shipping per product
  },
  
  // GST percentage
  gstPercent: {
    type: Number,
    default: 18, // 18% GST
    min: 0,
    max: 100,
  },
  
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  
  // Keep user for backward compatibility (admin who approved)
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);