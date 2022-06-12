const express = require("express");
const {
  creditWallet,
  debitWallet,
  currentWallet,
  //createWallet,
  updateWallet,
  deleteWallet,
  getWallet,
  getWallets, 
} = require("../controllers/wallet");
const { verifyAdmin, verifyToken, verifyUser } = require("../utils/verifyToken.js");

const router = express.Router();

//CREDIT
router.post("/credit", verifyToken, creditWallet);

//DEBIT
router.post("/debit", verifyToken, debitWallet);

//CURRENT WALLET
router.get("/current", verifyToken, currentWallet);

//CREATE
//router.post("/", verifyToken, createWallet);

//UPDATE
router.put("/:id", verifyAdmin, updateWallet);

//DELETE
router.delete("/:id", verifyAdmin, deleteWallet);

//GET
router.get("/:id", verifyAdmin, getWallet);
 
//GET ALL
router.get("/", verifyAdmin, getWallets);

module.exports = router;
