const express = require("express");
const { allowedTo, protect } = require("../services/authService");

const {
  addToAddresses,
  getAllFromaddresses,
  deleteFromAddresses,
} = require("../services/addressService");
const {
  addToAddressesValidator,
} = require("../utils/validation/userValidtator");

const router = express.Router();
router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addToAddressesValidator, addToAddresses)
  .get(getAllFromaddresses);
router.route("/:addressId").delete(deleteFromAddresses);

module.exports = router;
