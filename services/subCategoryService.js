const subCategoryModel = require("../models/subCategoryModel");
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./refHandler");

exports.setCategoryId = (req, res, next) => {
  req.body.category = req.body.category
    ? req.body.category
    : req.params.categoryId;
  next();
};

// @desc create subcateory
// @route POST /api/v1/subcategories
// @access private
exports.createSubCategory = createOne(subCategoryModel);

//@nested Route
// /api/v1/categories/:categoryId/subcategories
exports.setQuery = (req, res, next) => {
  req.filter_ = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};
  next();
};

// @desc get list of subcateories
// @route GET /api/v1/subcategories
// @access puplic
exports.getAllSubCategories = getAll(subCategoryModel);

// @desc get specific subcateoriy by id
// @route GET /api/v1/subcategories/:id
// @access puplic
exports.getSubCategory = getOne(subCategoryModel);

// @desc update specific subcateoriy
// @route PUT /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = updateOne(subCategoryModel);

// @desc delete specific subcateoriy
// @route DELETE /api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = deleteOne(subCategoryModel);
