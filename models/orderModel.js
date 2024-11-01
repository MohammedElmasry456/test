const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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
    taxiPrice: Number,
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postal: String,
    },
    shippingPrice: Number,
    totalPrice: Number,
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliverAt: Date,
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone profileImage",
  }).populate({ path: "cartItems.product", select: "title imageCover" });
  next();
});

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
