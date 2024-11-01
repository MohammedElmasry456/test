const asyncHandle = require("express-async-handler");

const stripe = require("stripe")(
  "sk_test_51QEbQ4KxKEwo0eCACaoVbks8kRRXjxtriikGdjwCJddJj2COieEZ1PuJzdeXgiAhKs93oX65qT0PRyEUACGzqoYI00UDfv73Mz"
);
const cartModel = require("../models/cartModel");
const ApiError = require("../utils/apiError");
const orderModel = require("../models/orderModel");
const ProductModel = require("../models/productModel");
const { getAll, getOne } = require("./refHandler");
const userModel = require("../models/userModel");

// @desc createCashOrder
// @route POST /api/v1/order
// @access private/user
exports.createCashOrder = asyncHandle(async (req, res, next) => {
  const taxiPrice = 0;
  const shippingPrice = 0;

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("You Don't Have Cart Yet", 404));
  }

  const { cartItems } = cart;
  let totalPrice = cart.totalPriceAfterDis
    ? cart.totalPriceAfterDis
    : cart.totalPrice;

  totalPrice = totalPrice + taxiPrice + shippingPrice;
  const order = await orderModel.create({
    cartItems,
    user: req.user._id,
    shippingAddress: req.body.shippingAddress,
    taxiPrice,
    shippingPrice,
    totalPrice,
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOption, {});
    await cartModel.deleteOne({ user: req.user._id });
  }

  res.status(201).send({
    status: "success",
    message: "order created successfully",
    data: order,
  });
});

exports.setFilter = async (req, res, next) => {
  req.filter_ = req.user.role === "user" ? { user: req.user._id } : {};
  next();
};

// @desc getAllOrders
// @route GET /api/v1/order
// @access private/user-admin-manager
exports.getAllOrders = getAll(orderModel);

// @desc getSpecificOrder
// @route GET /api/v1/order/:id
// @access private/user-admin-manager
exports.getSpecificOrder = getOne(orderModel);

// @desc updateOrderToPaied
// @route PUT /api/v1/order/:id/pay
// @access private/user
exports.updateOrderToPaied = asyncHandle(async (req, res, next) => {
  const order = await orderModel.findOneAndUpdate(
    { _id: req.params.id },
    { isPaid: true, paidAt: Date.now() },
    { new: true }
  );
  if (!order) {
    return next(new ApiError("You Don't Have Order Yet", 404));
  }

  res.status(200).send({
    status: "success",
    message: "order Paid successfully",
    data: order,
  });
});

// @desc updateOrderToDelivered
// @route PUT /api/v1/order/:id/pay
// @access private/user
exports.updateOrderToDelivered = asyncHandle(async (req, res, next) => {
  const order = await orderModel.findOneAndUpdate(
    { _id: req.params.id },
    { isDelivered: true, deliverAt: Date.now() },
    { new: true }
  );
  if (!order) {
    return next(new ApiError("You Don't Have Order Yet", 404));
  }

  res.status(200).send({
    status: "success",
    message: "order Delivered successfully",
    data: order,
  });
});

const webhookFun = asyncHandle(async (session) => {
  const email = session.customer_email;
  const totalPrice = session.amount_total / 100;
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;

  const cart = await cartModel.findById(cartId);
  const user = await userModel.findOne({ email });

  const order = await orderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  if (order) {
    console.log("order created");
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOption, {});
    await cartModel.findByIdAndDelete(cartId);
  }
});

exports.webhookCheckOut = async (req, res) => {
  let event = req.body;
  if (process.env.STRIPE_Signing_Secret) {
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_Signing_Secret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }
  if (event.type === "checkout.session.completed") {
    webhookFun(event.data.object);
  }
  res.status(200).send({ receivied: true });
};

// @desc checkOutSession
// @route GET /api/v1/order/checkOut
// @access private/users
exports.checkOutSession = asyncHandle(async (req, res, next) => {
  const taxiPrice = 0;
  const shippingPrice = 0;

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("You Don't Have Cart Yet", 404));
  }
  // const { cartItems } = cart;

  let totalPrice = cart.totalPriceAfterDis
    ? cart.totalPriceAfterDis
    : cart.totalPrice;

  totalPrice = totalPrice + taxiPrice + shippingPrice;
  // const line_items = [];
  // cartItems.map((e) => {
  //   line_items.push({
  //     price_data: {
  //       currency: "egp",
  //       product_data: {
  //         name: e.product.title,
  //         images: [
  //           `${req.protocol}://${req.get("host")}/products/${e.product.imageCover}`,
  //         ],
  //       },
  //       unit_amount: e.price * e.quantity * 100,
  //     },
  //     quantity: 1,
  //   });
  //   console.log(
  //     `${req.protocol}://${req.get("host")}/products/${e.product.imageCover}`
  //   );
  // });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    client_reference_id: cart._id.toString(),
    customer_email: req.user.email,
    metadata: req.body.shippingAddress,
  });

  res.status(200).send({
    status: "success",
    session,
  });
});
