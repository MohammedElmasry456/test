const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./refHandler");
const couponModel = require("../models/couponModel");

// @desc create coupon
// @route POST /api/v1/coupons
// @access private/admin-manager
exports.createCoupon = createOne(couponModel);

// @desc get list of Coupons
// @route GET /api/v1/coupons
// @access privatev/admin-manager
exports.getAllCoupons = getAll(couponModel);

// @desc get specific Coupon by id
// @route GET /api/v1/coupons/:id
// @access private/admin-manager
exports.getCoupon = getOne(couponModel);

// @desc update specific Coupon
// @route PUT /api/v1/coupons/:id
// @access private/admin-manager
exports.updateCoupon = updateOne(couponModel);

// @desc delete specific Coupon
// @route DELETE /api/v1/coupons/:id
// @access private/admin-manager
exports.deleteCoupon = deleteOne(couponModel);
