const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendMail = require("../utils/sendMail");
const createToken = require("../utils/createToken");

// @desc signUp
// @route POST /api/v1/auth/signUp
// @access public
exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc login
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect Email Or Password", 401));
  }

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You Are Not Login, Please Login Again...", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_CODE);

  const user = await userModel.findById(decode.userId);
  if (!user) {
    return next(
      new ApiError("The User Not Found, Please Login Again Or SignUp", 401)
    );
  }
  if (!user.active) {
    return next(
      new ApiError("You Must Active Your Account To Access This Route", 401)
    );
  }

  if (user.passwordChangedAt) {
    const changeTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    if (changeTime > decode.iat) {
      return next(
        new ApiError("The Password Changed, Please Login Again...", 401)
      );
    }
  }

  req.user = user;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You Are Not Allowed To Access This Route", 403)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There Is No User For That Email", 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.PasswordResetCode = hashResetCode;
  user.PasswordResetCodeExpire = Date.now() + 10 * 60 * 1000;
  user.PasswordResetVerified = false;

  user.save();
  try {
    await sendMail({
      email: user.email,
      subject: "Your Password Reset Code Will Valid For 10 min",
      message: `Reset Code: ${resetCode} `,
    });
  } catch (err) {
    user.PasswordResetCode = undefined;
    user.PasswordResetCodeExpire = undefined;
    user.PasswordResetVerified = undefined;
    user.save();
    return next(new ApiError("Error In Send Reset Code", 500));
  }

  res
    .status(200)
    .send({ status: "success", message: "Reset Code Send Successfully" });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    PasswordResetCode: crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex"),
    PasswordResetCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset Code Invalid Or Expired", 400));
  }

  user.PasswordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new ApiError("Email Not Belong To User", 404));
  }

  if (!user.PasswordResetVerified) {
    return next(new ApiError("You Must Verify The Reset Code", 400));
  }

  user.password = req.body.newPassword;
  user.PasswordResetCode = undefined;
  user.PasswordResetCodeExpire = undefined;
  user.PasswordResetVerified = undefined;
  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});
