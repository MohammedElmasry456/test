const express = require("express");
const {
  signUpValidator,
  loginValidator,
} = require("../utils/validation/authValidtator");
const {
  signUp,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.route("/signUp").post(signUpValidator, signUp);
router.route("/login").post(loginValidator, login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyResetCode").post(verifyResetCode);
router.route("/resetPassword").put(resetPassword);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(userImageUpload, resizeImageUpload, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
