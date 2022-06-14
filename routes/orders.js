const express = require("express");
const {
  createOrder,
  assignRider_to_Order,
  updateOrder,
  deleteOrder,
  getOrder,
  getUserOrders,
  getOrders, 
} = require("../controllers/order");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createOrder);

//assign rider to your order
router.post("/assignRider/:id", verifyToken, assignRider_to_Order);

//UPDATE
router.put("/:id", verifyAdmin, updateOrder);

//DELETE
router.delete("/:id", verifyAdmin, deleteOrder);

//GET
router.get("/:id", verifyToken, getOrder);

//GET ALL USER Orders
router.get("/find/myOrders", verifyToken, getUserOrders);
 
//GET ALL
router.get("/", verifyAdmin, getOrders);

module.exports = router;
