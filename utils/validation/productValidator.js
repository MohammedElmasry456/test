const slugify = require("slugify");
const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("title Required")
    .isLength({ min: 3 })
    .withMessage("Too Short Product Title")
    .isLength({ max: 100 })
    .withMessage("Too Long Product Title")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("title Required")
    .isLength({ min: 20 })
    .withMessage("Too Short Product Title"),
  check("imageCover").notEmpty().withMessage("Product Image Cover Required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("The Images Must Be Array Of String"),
  check("colors")
    .optional()
    .isArray()
    .withMessage("The colors Must Be Array Of String"),
  check("quantity")
    .notEmpty()
    .withMessage("quantity Required")
    .isNumeric()
    .withMessage("quantity Must Be Number"),
  check("sold").optional().isNumeric().withMessage("sold Must Be Number"),
  check("price")
    .notEmpty()
    .withMessage("Product Price is required")
    .isNumeric()
    .withMessage("price Must Be Number")
    .isFloat({ max: 200000 })
    .withMessage("Too Long Price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("price Must Be Number")
    .toFloat()
    .isLength({ max: 32 })
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "The price After Discount Must Be Lower Than The Current Price"
        );
      }
      return true;
    }),
  check("ratingAverage")
    .optional()
    .toFloat()
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("The Rating Must Be Between 1.0 and 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratings Quantity Must Be Number"),
  check("category")
    .notEmpty()
    .withMessage("Product Must Belong To Category")
    .isMongoId()
    .withMessage("Invalid Category Id Format")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`not valid category id : ${categoryId}`)
          );
        }
      })
    ),
  check("model").optional().isMongoId().withMessage("Invalid model Id Format"),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategory Id Format")
    .custom((ids) =>
      subCategoryModel
        .find({ _id: { $exists: true, $in: ids } })
        .then((res) => {
          if (res.length < 1 || res.length < ids.length) {
            return Promise.reject(new Error(`not valid subcategories id `));
          }
        })
    )
    .custom((val, { req }) =>
      subCategoryModel
        .find({ category: req.body.category })
        .then((subCategories) => {
          const subCategoriesId = subCategories.map((e) => e._id.toString());
          const checker = val.every((e) => subCategoriesId.includes(e));
          if (!checker) {
            return Promise.reject(
              new Error(`Subcategories Id Not to Belong To Category`)
            );
          }
        })
    ),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id Format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id Format"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id Format"),
  validatorMiddleware,
];
