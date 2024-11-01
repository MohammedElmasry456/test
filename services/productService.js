const asyncHandle = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixImage } = require("../middlewares/uploadImageMiddleware");
const ProductModel = require("../models/productModel");
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./refHandler");

exports.productImageUpload = uploadMixImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImageUpload = asyncHandle(async (req, res, next) => {
  if (req.files.imageCover) {
    const coverName = `product-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(700, 1000)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${coverName}`);

    req.body.imageCover = coverName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const filename = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;
        await sharp(image.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${filename}`);

        req.body.images.push(filename);
      })
    );
  }
  next();
});
// @desc create Product
// @route POST /api/v1/products
// @access private
exports.createProduct = createOne(ProductModel);

// @desc get list of products
// @route GET /api/v1/products
// @access puplic
exports.getAllProducts = getAll(ProductModel);
// @desc get specific product by id
// @route GET /api/v1/products/:id
// @access puplic
exports.getProduct = getOne(ProductModel, "reviews");

// @desc update specific product
// @route PUT /api/v1/products/:id
// @access private
exports.updateProduct = updateOne(ProductModel);

// @desc delete specific product
// @route DELETE /api/v1/products/:id
// @access private
exports.deleteProduct = deleteOne(ProductModel);
