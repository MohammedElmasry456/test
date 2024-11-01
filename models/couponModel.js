const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name Required"],
      unique: [true, "coupon name Must Be Unique"],
    },
    expire: {
      type: Date,
      required: [true, "expire Date Required"],
    },
    discount: {
      type: Number,
      required: [true, "discount value Required"],
      min: [1, "Min Discount Value Equal 1%"],
      max: [99, "max Discount Value Equal 99%"],
    },
  },
  {
    timestamps: true,
  }
);

const couponModel = mongoose.model("coupon", couponSchema);
module.exports = couponModel;
