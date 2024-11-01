const express = require("express");
const {
  userImageUpload,
  resizeImageUpload,
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  getLoggedUser,
  changeMyPassword,
  updateMe,
  deleteMe,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updatePasswordValidator,
  updateMeValidator,
} = require("../utils/validation/userValidtator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();
router.use(protect);

router.get("/getMe", getLoggedUser, getUser);
router.put("/changeMyPassword", changeMyPassword);
router.put("/updateMe", updateMeValidator, updateMe);
router.put("/deleteMe", deleteMe);

//Admin
router.use(allowedTo("manager", "admin"));
router.put("/changePassword/:id", updatePasswordValidator, updateUserPassword);

router
  .route("/")
  .post(userImageUpload, resizeImageUpload, createUserValidator, createUser)
  .get(getAllUsers);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(userImageUpload, resizeImageUpload, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
