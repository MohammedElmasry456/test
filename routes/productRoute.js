const express = require("express");
const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  productImageUpload,
  resizeImageUpload,
} = require("../services/productService");
const {
  deleteProductValidator,
  createProductValidator,
  getProductValidator,
  updateProductValidator,
} = require("../utils/validation/productValidator");
const reviewRoute = require("./reviewRoute");

const { protect, allowedTo } = require("../services/authService");

const router = express.Router();
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .post(
    protect,
    allowedTo("manager", "admin"),
    productImageUpload,
    resizeImageUpload,
    createProductValidator,
    createProduct
  )
  .get(getAllProducts);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    allowedTo("manager", "admin"),
    productImageUpload,
    resizeImageUpload,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
