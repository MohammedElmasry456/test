const asyncHandle = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const CategoryModel = require("../models/categoryModel");

const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./refHandler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.categoryImageUpload = uploadSingleImage("image");
exports.resizeImageUpload = asyncHandle(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);
  req.body.image = fileName;
  next();
});

// @desc create cateory
// @route POST /api/v1/categories
// @access private
exports.createCategory = createOne(CategoryModel);

// @desc get list of cateories
// @route GET /api/v1/categories
// @access puplic
exports.getAllCategories = getAll(CategoryModel);

// @desc get specific cateoriy by id
// @route GET /api/v1/categories/:id
// @access puplic
exports.getCategory = getOne(CategoryModel);

// @desc update specific cateoriy
// @route PUT /api/v1/categories/:id
// @access private
exports.updateCategory = updateOne(CategoryModel);

// @desc delete specific cateoriy
// @route DELETE /api/v1/categories/:id
// @access private
exports.deleteCategory = deleteOne(CategoryModel);
