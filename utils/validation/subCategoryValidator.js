const slugify = require("slugify");
const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory Required")
    .isLength({ min: 2 })
    .withMessage("Too Short SubCategory Name")
    .isLength({ max: 32 })
    .withMessage("Too Long SubCategory Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("SubCategory Must Belong To Category")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];
