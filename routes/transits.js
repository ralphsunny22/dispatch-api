const express = require("express");
const {
  createTransit,
  updateTransit,
  deleteTransit,
  getTransit,
  getTransits, 
} = require("../controllers/transit.js");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createTransit);

//UPDATE
router.put("/:id", verifyAdmin, updateTransit);

//DELETE
router.delete("/:id", verifyAdmin, deleteTransit);

//GET
router.get("/:id", verifyAdmin, getTransit);
 
//GET ALL
router.get("/", verifyAdmin, getTransits);

module.exports = router;
