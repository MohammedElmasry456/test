const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product Title Required"],
      trim: true,
      minlength: [3, "Too Short Product Title"],
      maxlength: [100, "Too Long Product Title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product Description Required"],
      trim: true,
      minlength: [20, "Too Short Product description"],
    },
    imageCover: {
      type: String,
      required: [true, "Product Image Cover Required"],
    },
    images: [String],
    colors: [String],
    quantity: {
      type: Number,
      required: [true, "Product Quantity Required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product Price is required"],
      max: [200000, "Too Long Price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    ratingAverage: {
      type: Number,
      min: [1, "Thr Rating Must Be Bigger Than Or Equal 1.0"],
      max: [5, "Thr Rating Must Be Lower Than Or Equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory",
      },
    ],
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "model",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const setUrl = (doc) => {
  if (doc.imageCover) {
    const url = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = url;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.map((image) => {
      const url = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(url);
    });
    doc.images = imagesList;
  }
};

ProductSchema.post("init", (doc) => {
  setUrl(doc);
});
ProductSchema.post("save", (doc) => {
  setUrl(doc);
});

ProductSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

ProductSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "product",
});

const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
