const express = require("express");
const {
  createReceivePackage,
  updateReceivePackage,
  deleteReceivePackage,
  getReceivePackage,
  getReceivePackages, 
} = require("../controllers/receivePackage");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createReceivePackage);

//UPDATE
router.put("/:id", verifyAdmin, updateReceivePackage);

//DELETE
router.delete("/:id", verifyAdmin, deleteReceivePackage);

//GET
router.get("/:id", verifyAdmin, getReceivePackage);
 
//GET ALL
router.get("/", verifyAdmin, getReceivePackages);

module.exports = router;
