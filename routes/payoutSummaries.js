const express = require("express");
const {
  createPayoutSummary,
  updatePayoutSummary,
  deletePayoutSummary,
  getPayoutSummary,
  getPayoutSummaries, 
} = require("../controllers/payoutSummary");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createPayoutSummary);

//UPDATE
router.put("/:id", verifyAdmin, updatePayoutSummary);

//DELETE
router.delete("/:id", verifyAdmin, deletePayoutSummary);

//GET
router.get("/:id", verifyAdmin, getPayoutSummary);
 
//GET ALL
router.get("/", verifyAdmin, getPayoutSummaries);

module.exports = router;
