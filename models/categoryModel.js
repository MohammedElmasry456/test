const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Required"],
      unique: [true, "Category Must Be Unique"],
      minlength: [3, "Too Short Category Name"],
      maxlength: [32, "Too Long Category Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

const setUrl = (doc) => {
  const url = `${process.env.BASE_URL}/categories/${doc.image}`;
  doc.image = url;
};

CategorySchema.post("init", (doc) => {
  setUrl(doc);
});
CategorySchema.post("save", (doc) => {
  setUrl(doc);
});

const CategoryModel = mongoose.model("category", CategorySchema);
module.exports = CategoryModel;
