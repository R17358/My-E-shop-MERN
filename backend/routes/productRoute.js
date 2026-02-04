const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  getAdminProductsById,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/selfproducts/:id").get(isAuthenticatedUser, authorizeRoles("admin", "seller"),getAdminProductsById);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin", "seller"), getAdminProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin", "seller"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin", "seller"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin", "seller"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
