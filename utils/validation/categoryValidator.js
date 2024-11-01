const slugify = require("slugify");
const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Required")
    .isLength({ min: 3 })
    .withMessage("Too Short Category Name")
    .isLength({ max: 32 })
    .withMessage("Too Long Category Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];
