const express = require("express");
const {
  createSendPackage,
  updateSendPackage,
  deleteSendPackage,
  getSendPackage,
  getSendPackages, 
} = require("../controllers/sendPackage.js");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREATE
router.post("/", verifyToken, createSendPackage);

//UPDATE
router.put("/:id", verifyAdmin, updateSendPackage);

//DELETE
router.delete("/:id", verifyAdmin, deleteSendPackage);

//GET
router.get("/:id", verifyAdmin, getSendPackage);
 
//GET ALL
router.get("/", verifyAdmin, getSendPackages);

module.exports = router;
