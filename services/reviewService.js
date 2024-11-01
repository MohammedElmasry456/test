const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./refHandler");
const reviewModel = require("../models/reviewModel");

//for filtering
exports.setQuery = (req, res, next) => {
  req.filter_ = req.params.productId ? { product: req.params.productId } : {};
  next();
};

//for create specific review
exports.setReviewUserAndProduct = (req, res, next) => {
  req.body.product = req.body.product ? req.body.product : req.params.productId;
  req.body.user = req.body.user ? req.body.user : req.user._id;
  next();
};

// @desc create Review
// @route POST /api/v1/reviews
// @access private
exports.createReview = createOne(reviewModel);

// @desc get list of Reviews
// @route GET /api/v1/reviews
// @access puplic
exports.getAllReviews = getAll(reviewModel);

// @desc get specific Review by id
// @route GET /api/v1/reviews/:id
// @access puplic
exports.getReview = getOne(reviewModel);

// @desc update specific Review
// @route PUT /api/v1/reviews/:id
// @access private
exports.updateReview = updateOne(reviewModel);

// @desc delete specific Review
// @route DELETE /api/v1/reviews/:id
// @access private
exports.deleteReview = deleteOne(reviewModel);
