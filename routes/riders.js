const express = require("express");
const {
  createRider,
  updateRider,
  deleteRider,
  getRider,
  getRiders, 
} = require("../controllers/rider.js");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", createRider);

//UPDATE
router.put("/:id", verifyAdmin, updateRider);

//DELETE
router.delete("/:id", verifyAdmin, deleteRider);

//GET
router.get("/:id", verifyAdmin, getRider);
 
//GET ALL
router.get("/", verifyAdmin, getRiders);

module.exports = router;
