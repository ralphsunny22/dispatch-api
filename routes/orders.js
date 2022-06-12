const express = require("express");
const {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  getOrders, 
} = require("../controllers/order");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createOrder);

//UPDATE
router.put("/:id", verifyAdmin, updateOrder);

//DELETE
router.delete("/:id", verifyAdmin, deleteOrder);

//GET
router.get("/:id", verifyAdmin, getOrder);
 
//GET ALL
router.get("/", verifyAdmin, getOrders);

module.exports = router;
