const express = require("express");
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setQuery,
  setCategoryId,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validation/subCategoryValidator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowedTo("manager", "admin"),
    setCategoryId,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(setQuery, getAllSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    protect,
    allowedTo("manager", "admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
