const express = require("express");
const {
  createRider,
  loginRider,
  cancelOrder,
  acceptOrder,
  enroutePickUp, enrouteDropOff, completeOrder,
  assignTransits_to_Rider,
  switchTransit,
  removeTransit,
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

//ACCEPT ORDER
router.get("/acceptOrder/:id", verifyRiderToken, acceptOrder);

//enroute PickUp, on the way to pick-up order
router.get("/enroutePickUp/:id", verifyRiderToken, enroutePickUp);

//enroute DropOff
router.get("/enrouteDropOff/:id", verifyRiderToken, enrouteDropOff);

//complete Order,
router.get("/completeOrder/:id", verifyRiderToken, completeOrder);

//ASSIGN TRANSITS
router.post("/assignTransits/:id", assignTransits_to_Rider);

//switch transit from rider's existing ones
router.get("/switchTransit/:id/:transitId", switchTransit);

//remove transit from rider
router.get("/removeTransit/:id/:transitId", removeTransit);


//UPDATE
router.put("/:id", verifyAdmin, updateRider);

//DELETE
router.delete("/:id", verifyAdmin, deleteRider);

//GET
router.get("/:id", verifyAdmin, getRider);
 
//GET ALL
router.get("/", getRiders);

module.exports = router;
