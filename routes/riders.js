const express = require("express");
const {
  createRider,
  loginRider,
  cancelOrder,
  assignTransits_to_Rider,
  updateRider,
  deleteRider,
  getRider,
  getRiders, 
} = require("../controllers/rider.js");
const { verifyAdmin } = require("../utils/verifyToken.js");
const { verifyRiderToken, verifyRider } = require("../utils/verifyRiderToken.js");

const router = express.Router();

//CREATE
router.post("/register", createRider);

//LOGIN
router.post("/login", loginRider);

//CANCEL ORDER
router.get("/cancelOrder/:id", verifyRiderToken, cancelOrder);

//ASSIGN TRANSITS
router.post("/assignTransits", assignTransits_to_Rider);

//UPDATE
router.put("/:id", verifyAdmin, updateRider);

//DELETE
router.delete("/:id", verifyAdmin, deleteRider);

//GET
router.get("/:id", verifyAdmin, getRider);
 
//GET ALL
router.get("/", getRiders);

module.exports = router;
