const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const reviewModel = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id Format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("The Rating Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("The Rating Between 1.0 And 5.0"),
  check("user")
    .notEmpty()
    .withMessage("The user Id Required")
    .isMongoId()
    .withMessage("Invalid User Id Format"),
  check("product")
    .notEmpty()
    .withMessage("The user Id Required")
    .isMongoId()
    .withMessage("Invalid Product Id Format")
    .custom((val, { req }) =>
      reviewModel.findOne({ user: req.user._id, product: val }).then((res) => {
        if (res) {
          return Promise.reject(new Error("You Reviewd This Product Before"));
        }
      })
    ),

  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id Format")
    .custom((val, { req }) =>
      reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("Review Not Found"));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You Are Not Allowed To Edit This Review")
          );
        }
      })
    ),
  check("title").optional(),
  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("The Rating Between 1.0 And 5.0"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id Format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return reviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("Review Not Found"));
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You Are Not Allowed To Delete This Review")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
