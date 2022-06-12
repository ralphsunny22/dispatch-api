const express = require("express");
const {
  createParcel,
  updateParcel,
  deleteParcel,
  getParcel,
  getParcels, 
} = require("../controllers/parcel.js");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createParcel);

//UPDATE
router.put("/:id", verifyAdmin, updateParcel);

//DELETE
router.delete("/:id", verifyAdmin, deleteParcel);

//GET
router.get("/:id", verifyAdmin, getParcel);
 
//GET ALL
router.get("/", verifyAdmin, getParcels);

module.exports = router;
