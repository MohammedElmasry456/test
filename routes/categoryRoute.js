const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  categoryImageUpload,
  resizeImageUpload,
} = require("../services/categoryService");

const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validation/categoryValidator");

const subCategoryRoute = require("./subCategoryRoute");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);
router
  .route("/")
  .post(
    protect,
    allowedTo("manager", "admin"),
    categoryImageUpload,
    resizeImageUpload,
    createCategoryValidator,
    createCategory
  )
  .get(getAllCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowedTo("manager", "admin"),
    categoryImageUpload,
    resizeImageUpload,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

module.exports = router;
