const mongoose = require("mongoose");
const ProductModel = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "The Rating Required"],
      min: [1, "The Min Rating Equal 1.0"],
      max: [5, "The Min Rating Equal 5.0"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user id required"],
      ref: "user",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "product id required"],
      ref: "product",
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.statics.calcAvgAndQuantity = async function (productId) {
  const results = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        ratingAverage: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (results.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingAverage: results[0].ratingAverage,
      ratingsQuantity: results[0].ratingsQuantity,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});
reviewSchema.post("save", async function () {
  await this.constructor.calcAvgAndQuantity(this.product);
});

const reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;
