const asyncHandle = require("express-async-handler");
const userModel = require("../models/userModel");

// @desc add to wishlist
// @route POST /api/v1/wishlist
// @access private/protect/user
exports.addToWishlist = asyncHandle(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "product Added Successfully",
    data: user.wishlist,
  });
});

// @desc delete from wishlist
// @route DELETE /api/v1/wishlist/:productId
// @access private/protect/user
exports.deleteFromWishlist = asyncHandle(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "product Removed Successfully",
    data: user.wishlist,
  });
});

// @desc get all from wishlist
// @route GET /api/v1/wishlist
// @access private/protect/user
exports.getAllFromWishlist = asyncHandle(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("wishlist");
  res.status(200).send({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
