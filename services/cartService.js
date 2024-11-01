const asyncHandle = require("express-async-handler");
const cartModel = require("../models/cartModel");
const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");
const couponModel = require("../models/couponModel");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.map((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDis = undefined;
};

// @desc AddToCart
// @route POST /api/v1/cart
// @access private/user
exports.addToCart = asyncHandle(async (req, res, next) => {
  const product = await ProductModel.findById(req.body.productId);
  if (!product) {
    return next(new ApiError("product not found", 404));
  }

  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.body.productId,
          color: req.body.color,
          price: product.price,
        },
      ],
    });
  } else {
    const indexItem = cart.cartItems.findIndex(
      (el) =>
        el.product.toString() === req.body.productId &&
        el.color === req.body.color
    );
    if (indexItem > -1) {
      cart.cartItems[indexItem].quantity += 1;
    } else {
      cart.cartItems.push({
        product: req.body.productId,
        color: req.body.color,
        price: product.price,
      });
    }
  }

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).send({
    status: "success",
    message: "Product Added Successfully",
    data: cart,
  });
});

// @desc getMyCart
// @route GET /api/v1/cart
// @access private/user
exports.getMyCart = asyncHandle(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("You Don't Have Cart Yet", 404));
  }
  res.status(200).send({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc deleteFromCart
// @route DELETE /api/v1/cart/:itemId
// @access private/user
exports.deleteFromCart = asyncHandle(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  if (!cart) {
    return next(new ApiError("You Don't Have Cart Yet", 404));
  }
  calcTotalPrice(cart);
  await cart.save();
  res.status(200).send({
    status: "success",
    NumOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc updateItemQuantity
// @route PUT /api/v1/icart/:itemId
// @access private/user
exports.updateItemQuantity = asyncHandle(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("You Don't Have Cart Yet", 404));
  }

  const indexItem = cart.cartItems.findIndex(
    (el) => el._id.toString() === req.params.itemId
  );

  if (indexItem > -1) {
    cart.cartItems[indexItem].quantity = req.body.quantity;
  } else {
    return next(new ApiError("Item Not Found", 404));
  }

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).send({
    status: "success",
    message: "Product Quantity Updated Successfully",
    data: cart,
  });
});

// @desc applyCoupon
// @route PUT /api/v1/cart/applyCoupon
// @access private/user
exports.applyCoupon = asyncHandle(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  const coupon = await couponModel.findOne({
    name: req.body.name,
    expire: { $gt: Date.now() },
  });

  if (!cart) {
    return next(new ApiError("You Don't Have Cart Yet", 404));
  }

  if (!coupon) {
    return next(new ApiError("Coupon Not Valid Or Expired", 400));
  }

  const totalPriceAfterDis = (
    cart.totalPrice -
    (cart.totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDis = totalPriceAfterDis;
  await cart.save();
  res.status(200).send({
    status: "success",
    message: "Coupon Aplied Successfully",
    data: cart,
  });
});

// @desc removeMyCart
// @route DELETE /api/v1/cart
// @access private/user
exports.removeMyCart = asyncHandle(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
