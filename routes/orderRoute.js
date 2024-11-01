const express = require("express");
const { allowedTo, protect } = require("../services/authService");
const {
  createCashOrder,
  setFilter,
  getAllOrders,
  getSpecificOrder,
  updateOrderToPaied,
  updateOrderToDelivered,
  checkOutSession,
} = require("../services/orderService");

const router = express.Router();
router.use(protect);

router.get("/checkOut", checkOutSession);

router
  .route("/")
  .post(allowedTo("user"), createCashOrder)
  .get(allowedTo("user", "admin", "manager"), setFilter, getAllOrders);

router.route("/:id/pay").put(allowedTo("admin", "manager"), updateOrderToPaied);
router
  .route("/:id/deliver")
  .put(allowedTo("admin", "manager"), updateOrderToDelivered);

router
  .route("/:id")
  .get(allowedTo("user", "admin", "manager"), getSpecificOrder);

module.exports = router;
