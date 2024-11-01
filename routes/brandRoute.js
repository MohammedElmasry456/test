const express = require("express");
const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  brandImageUpload,
  resizeImageUpload,
} = require("../services/brandService");
const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  createBrandValidator,
} = require("../utils/validation/brandValidtator");
const { allowedTo, protect } = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    allowedTo("manager", "admin"),
    brandImageUpload,
    resizeImageUpload,
    createBrandValidator,
    createBrand
  )
  .get(getAllBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowedTo("manager", "admin"),
    brandImageUpload,
    resizeImageUpload,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
