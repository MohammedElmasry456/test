const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const couponModel = require("../../models/couponModel");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name required")
    .toUpperCase()
    .custom((val) =>
      couponModel.findOne({ name: val }).then((res) => {
        if (res) {
          return Promise.reject(new Error("Coupon Is Already Exist"));
        }
      })
    ),
  check("expire").notEmpty().withMessage("Expire Date Required"),
  check("discount")
    .notEmpty()
    .withMessage("discount value Required")
    .isFloat({ min: 1 })
    .withMessage("Min Discount Value Equal 1%")
    .isFloat({ max: 99 })
    .withMessage("max Discount Value Equal 99%"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  check("name")
    .optional()
    .toUpperCase()
    .custom((val) =>
      couponModel.findOne({ name: val }).then((res) => {
        if (res) {
          return Promise.reject(new Error("Coupon Is Already Exist"));
        }
      })
    ),
  check("discount")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Min Discount Value Equal 1%")
    .isFloat({ max: 99 })
    .withMessage("max Discount Value Equal 99%"),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddleware,
];
