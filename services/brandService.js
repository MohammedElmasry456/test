const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandle = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const brandModel = require("../models/brandModel");
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./refHandler");

exports.brandImageUpload = uploadSingleImage("image");
exports.resizeImageUpload = asyncHandle(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
  req.body.image = fileName;
  next();
});

// @desc create brand
// @route POST /api/v1/brands
// @access private
exports.createBrand = createOne(brandModel);

// @desc get list of brands
// @route GET /api/v1/brands
// @access puplic
exports.getAllBrands = getAll(brandModel);

// @desc get specific brand by id
// @route GET /api/v1/brands/:id
// @access puplic
exports.getBrand = getOne(brandModel);

// @desc update specific brand
// @route PUT /api/v1/brands/:id
// @access private
exports.updateBrand = updateOne(brandModel);

// @desc delete specific brand
// @route DELETE /api/v1/brands/:id
// @access private
exports.deleteBrand = deleteOne(brandModel);
