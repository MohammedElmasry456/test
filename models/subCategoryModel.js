const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "subCategory Required"],
      trim: true,
      minlength: [2, "Too Short subCategory Name"],
      maxlength: [32, "Too Long subCategory Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = mongoose.model("subcategory", subCategorySchema);
module.exports = subCategoryModel;
