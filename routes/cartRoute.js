const express = require("express");
const { allowedTo, protect } = require("../services/authService");
const {
  addToCart,
  getMyCart,
  deleteFromCart,
  updateItemQuantity,
  applyCoupon,
  removeMyCart,
} = require("../services/cartService");

const router = express.Router();
router.use(protect, allowedTo("user"));

router.route("/").post(addToCart).get(getMyCart).delete(removeMyCart);
router.route("/applyCoupon").put(applyCoupon);
router.route("/:itemId").delete(deleteFromCart).put(updateItemQuantity);

module.exports = router;
