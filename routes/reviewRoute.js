const express = require("express");
const { allowedTo, protect } = require("../services/authService");
const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  setQuery,
  setReviewUserAndProduct,
} = require("../services/reviewService");
const {
  updateReviewValidator,
  deleteReviewValidator,
  createReviewValidator,
} = require("../utils/validation/reviewValidtator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    setReviewUserAndProduct,
    createReviewValidator,
    createReview
  )
  .get(setQuery, getAllReviews);
router
  .route("/:id")
  .get(getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
