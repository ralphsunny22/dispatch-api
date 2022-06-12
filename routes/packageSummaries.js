const express = require("express");
const {
  createPackageSummary,
  updatePackageSummary,
  deletePackageSummary,
  getPackageSummary,
  getPackageSummaries, 
} = require("../controllers/packageSummary");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createPackageSummary);

//UPDATE
router.put("/:id", verifyAdmin, updatePackageSummary);

//DELETE
router.delete("/:id", verifyAdmin, deletePackageSummary);

//GET
router.get("/:id", verifyAdmin, getPackageSummary);
 
//GET ALL
router.get("/", verifyAdmin, getPackageSummaries);

module.exports = router;
