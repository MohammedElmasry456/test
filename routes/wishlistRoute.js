const express = require("express");
const { allowedTo, protect } = require("../services/authService");
const {
  addToWishlist,
  getAllFromWishlist,
  deleteFromWishlist,
} = require("../services/wishlistService");

const router = express.Router();
router.use(protect, allowedTo("user"));

router.route("/").post(addToWishlist).get(getAllFromWishlist);
router.route("/:productId").delete(deleteFromWishlist);

module.exports = router;
