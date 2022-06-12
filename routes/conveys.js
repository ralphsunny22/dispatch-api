const express = require("express");
const {
  createConvey,
  updateConvey,
  deleteConvey,
  getConvey,
  getConveys, 
} = require("../controllers/convey.js");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createConvey);

//UPDATE
router.put("/:id", verifyAdmin, updateConvey);

//DELETE
router.delete("/:id", verifyAdmin, deleteConvey);

//GET
router.get("/:id", verifyAdmin, getConvey);
 
//GET ALL
router.get("/", verifyAdmin, getConveys);

module.exports = router;
