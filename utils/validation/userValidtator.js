const bcryptjs = require("bcryptjs");
const slugify = require("slugify");
const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too Short User Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("The Email Already Found"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("User Password required")
    .isLength({ min: 6 })
    .withMessage("Too Short User Password")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("The Password Not Equal Confirm Password");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("User Confirm Password required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number EG or SA Valid"),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  validatorMiddleware,
];

exports.updateMeValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("The Email Already Found"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number EG or SA Valid"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("The Email Already Found"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Phone Number EG or SA Valid"),
  validatorMiddleware,
];

exports.updatePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  check("currentPassword").notEmpty().withMessage("Current Password Required"),
  check("confirmPassword").notEmpty().withMessage("Confirm Password Required"),
  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("User Not Found");
      }
      const isCorrect = await bcryptjs.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) {
        throw new Error("Current Password Incorrect");
      }

      if (val !== req.body.confirmPassword) {
        throw new Error("The Password Not Equal Confirm Password");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  validatorMiddleware,
];

exports.addToAddressesValidator = [
  check("alias")
    .notEmpty()
    .withMessage("alias is required")
    .custom((val, { req }) =>
      userModel.findById(req.user._id).then((res) => {
        if (res.addresses) {
          const check_ = res.addresses.every((el) => el.alias !== val);
          if (!check_) {
            return Promise.reject(new Error("Alias Already Exist"));
          }
        }
      })
    ),
  validatorMiddleware,
];
