const asyncHandle = require("express-async-handler");
const userModel = require("../models/userModel");

// @desc add to addresses
// @route POST /api/v1/address
// @access private/protect/user
exports.addToAddresses = asyncHandle(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "address Added Successfully",
    data: user.addresses,
  });
});

// @desc delete from address
// @route DELETE /api/v1/address/:addressId
// @access private/protect/user
exports.deleteFromAddresses = asyncHandle(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "address Removed Successfully",
    data: user.addresses,
  });
});

// @desc get all from addresses
// @route GET /api/v1/address
// @access private/protect/user
exports.getAllFromaddresses = asyncHandle(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.status(200).send({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
