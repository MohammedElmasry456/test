const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Product Id Required"],
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User Id Required"],
      ref: "user",
    },
    totalPrice: Number,
    totalPriceAfterDis: Number,
  },
  {
    timestamps: true,
  }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "title imageCover price",
  });
  next();
});

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;
