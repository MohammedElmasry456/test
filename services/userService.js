const sharp = require("sharp");
const bcryptjs = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const asyncHandle = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { deleteOne, createOne, getOne, getAll } = require("./refHandler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

exports.userImageUpload = uploadSingleImage("profileImage");
exports.resizeImageUpload = asyncHandle(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);
    req.body.profileImage = fileName;
  }

  next();
});

// @desc create user
// @route POST /api/v1/users
// @access private
exports.createUser = createOne(userModel);

// @desc get list of users
// @route GET /api/v1/users
// @access private
exports.getAllUsers = getAll(userModel);

// @desc get specific user by id
// @route GET /api/v1/users/:id
// @access private
exports.getUser = getOne(userModel);

// @desc update specific user
// @route PUT /api/v1/users/:id
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      slug: req.body.slug,
      active: req.body.active,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new ApiError(`not user for this id ${id}`, 404));
  }
  res.status(200).json({ data: user });
});
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    id,
    {
      password: await bcryptjs.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new ApiError(`not user for this id ${id}`, 404));
  }
  res.status(200).json({ data: user });
});

// @desc delete specific user
// @route DELETE /api/v1/users/:id
// @access private
exports.deleteUser = deleteOne(userModel);

// @desc get My Profile
// @route GET /api/v1/users/getMe
// @access private
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc update My password
// @route PUT /api/v1/users/changeMyPassword
// @access private
exports.changeMyPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcryptjs.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc update My Profile
// @route PUT /api/v1/users/updateMe
// @access private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ data: user });
});

// @desc Deactive My Profile
// @route PUT /api/v1/users/deleteMe
// @access private
exports.deleteMe = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).send({ status: "success" });
});
