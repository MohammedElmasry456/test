const express = require("express");

const { allowedTo, protect } = require("../services/authService");
const {
  deleteCoupon,
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} = require("../services/couponService");
const {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../utils/validation/couponValidtator");

const router = express.Router();
router.use(protect, allowedTo("manager", "admin"));

router.route("/").post(createCouponValidator, createCoupon).get(getAllCoupons);
router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
