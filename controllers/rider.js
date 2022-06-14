const Rider = require("../models/Rider");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("../utils/error");
const Order = require("../models/Order");
const User = require("../models/User");
const Transit = require("../models/Transit");

const createRider = async (req, res, next) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      
      //copy reqs, hash password
      const newRider = new Rider({
        ...req.body,
        password: hash,
      });
  
      await newRider.save();
      res.status(200).send({message:"Rider has been created successfully.", success: true});
    } catch (err) {
      next(err);
    }
};

const loginRider = async (req, res, next) => {
    try {
      const rider = await Rider.findOne({ email: req.body.email });
      if (!rider) return next(createError(404, "Rider not found!"));
  
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        rider.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Wrong Credentials Provided"));
  
      //generate token, after comparing possible outcomes
      const token = jwt.sign(
        { id: rider._id }, //'id' will use to verifyRider Token later
        process.env.JWT_SECRET_KEY
      );
      
      
      //excluding some returned values to client-side
      const { password, currentTransit, ...otherDetails } = rider._doc;
    //   res.status(200).json({...otherDetails});
      res
        .cookie("rider_access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ details: { ...otherDetails }, currentTransit });
    } catch (err) {
      next(err);
    }
  };

  //riders can cancel an order on request of user
  const cancelOrder = async (req,res,next)=>{
    // const riderId = req.riderTokenInfo.id;
    const riderId = req.params.id;
    const rider = await Rider.findById( riderId );
    const orderId = rider.pendingOrderId;
    if(!orderId) return res.status(400).json({ message:"Bad request", success: false })

    const cancelledOrderStatus = rider.pendingOrderId == "" ? "accepted" : "pending"
    const reason = [{ client: "Client Requested", rider: req.body.reason ? req.body.reason : "Client Declined", }]

    const cancelledOrders = [{ orderId: orderId, cancelledOrderStatus, reason }]

        try {
        const updatedRider = await Rider.findByIdAndUpdate( riderId, 
            { 
            $push: { cancelledOrders: cancelledOrders },
            hasCancelledOrder: true,
            isAvailableForOrder: true,
            pendingOrderId: "",
            hasAcceptedOrder: false,
            acceptedOrderId: "",
            enroutePickUp: false,
            enrouteDropOff: false, 
            },
            { new: true }
        );
        //update order
        await Order.findByIdAndUpdate( orderId, 
            { isAssignedRider: false, riderId: "", riderAccepted: false,  },
        );
        res.status(200).json(updatedRider);
        } catch (err) {
        next(err);
        }
    }

  //accept order
  const acceptOrder = async (req,res,next)=>{
    // const riderId = req.riderTokenInfo.id;
    const riderId = req.params.id;
    const rider = await Rider.findById( riderId );
    const orderId = rider.pendingOrderId;
    if(!orderId) return res.status(400).json({ message:"Order already accepted by you. Enroute Pick-up Destination", success: false })

    try {
      const updatedRider = await Rider.findByIdAndUpdate( riderId, 
        { 
          hasCancelledOrder: false,
          isAvailableForOrder: false,
          hasAcceptedOrder: true,
          pendingOrderId: "", //moved to accepted 
          acceptedOrderId: orderId, 
        },
        { new: true }
      );
      //update order
      await Order.findByIdAndUpdate( orderId, 
        { isAssignedRider: true, riderId: riderId, riderAccepted: true, riderOnPickUp: false, riderOnDropOff: false },
        { new: true }
      );
      res.status(200).json(updatedRider);
    } catch (err) {
      next(err);
    }
  }

  const enroutePickUp = async (req,res,next)=>{
    // const riderId = req.riderTokenInfo.id;
    const riderId = req.params.id;
    const rider = await Rider.findById( riderId );
    const orderId = rider.acceptedOrderId;
    if(!orderId) return res.status(400).json({ message:"Bad request", success: false })

    try {
      const updatedRider = await Rider.findByIdAndUpdate( riderId, 
        { 
          hasCancelledOrder: false,
          isAvailableForOrder: false,
          hasAcceptedOrder: true,
          acceptedOrderId: orderId, 
          enroutePickUp: true,
          enrouteDropOff: false,
        },
        { new: true }
      );
      //update order
      await Order.findByIdAndUpdate( orderId, 
        { isAssignedRider: true, riderId: riderId, riderOnPickUp: true, riderOnDropOff: false, status: "onTransit" },
        { new: true }
      );
      res.status(200).json({updatedRider, message: "Enroute Pick-up destination"});
    } catch (err) {
      next(err);
    }
  }

  const enrouteDropOff = async (req,res,next)=>{
    // const riderId = req.riderTokenInfo.id;
    const riderId = req.params.id;
    const rider = await Rider.findById( riderId );
    const orderId = rider.acceptedOrderId;
    if(!orderId) return res.status(400).json({ message:"Bad request", success: false })

    try {
      const updatedRider = await Rider.findByIdAndUpdate( riderId, 
        { 
          hasCancelledOrder: false,
          isAvailableForOrder: false,
          hasAcceptedOrder: true,
          acceptedOrderId: orderId, 
          enroutePickUp: false,
          enrouteDropOff: true,
        },
        { new: true }
      );
      //update order
      await Order.findByIdAndUpdate( orderId, 
        { isAssignedRider: true, riderId: riderId, riderOnPickUp: false, riderOnDropOff: true, status: "onTransit" },
        { new: true }
      );
      res.status(200).json({updatedRider, message: "Enroute Drop-off destination"});
    } catch (err) {
      next(err);
    }
  }

  //completedOrder
  const completeOrder = async (req,res,next)=>{
    // const riderId = req.riderTokenInfo.id;
    const riderId = req.params.id;
    const rider = await Rider.findById( riderId );
    const orderId = rider.acceptedOrderId;
    if(!orderId) return res.status(400).json({ message:"Bad request", success: false })

    const order = await Order.findById(orderId)

    const from = order.sender[0].address
    const to = order.receiver[0].address

    const userId = order.userId

    const user = await User.findById(userId)
    const name = user.firstname + user.lastname;
    const email = user.email
    const phone = user.phoneNumber
    const client = [{ name: name, email: email, phone: phone }]

    const isInsured = order.isInsured
    const tripMode = order.tripMode

    const payment = [{ method: order.paymentMethod, isPaid: true, amount: order.amount  }]

    const completedOrders = [{ orderId, from, to, client, isInsured, tripMode, payment }]

    try {
      const updatedRider = await Rider.findByIdAndUpdate( riderId, 
        { 
            $push: { completedOrders: completedOrders },
            hasCancelledOrder: false,
            isAvailableForOrder: true,
            pendingOrderId: "",
            hasAcceptedOrder: false,
            acceptedOrderId: "",
            enroutePickUp: false,
            enrouteDropOff: false,  
        },
        { new: true }
      );
      //update order
      await Order.findByIdAndUpdate( orderId, 
        { 
          isAssignedRider: true,
          riderId: riderId, //record purpose, even after completion
          riderCompleted: true,
          riderAccepted: false,
          riderOnPickUp: false,
          riderOnDropOff: false,
          isPaid: true,
          status: "completed" 
        },
        { new: true }
      );
      res.status(200).json(updatedRider);
    } catch (err) {
      next(err);
    }
  }

//assign transits, to riders
const assignTransits_to_Rider = async (req,res,next)=>{
    const rider = await Rider.findById( req.params.id );
    //return res.send(rider.allocatedTransits);
    const existing_transits = rider.allocatedTransits.length ? rider.allocatedTransits : []; //single dimensional
    const new_transits = req.body.transits; //arr2

    //compare if any value of "new_transits" exists in "existing_transits"
    const found = existing_transits.some(r => new_transits.includes(r))
    if (found) return res.status(404).json({ error: "Duplicate Records Not Allowed!" });
    
  try {
    const updatedRider = await Rider.findByIdAndUpdate( req.params.id, { 
        $push: { allocatedTransits: req.body.transits }
    },
    //   { $set: req.body },
    { new: true }
    );
    res.status(200).json(updatedRider);
  } catch (err) {
    next(err);
  }
}

//rider decides to switch or update from his existing transits
const switchTransit = async (req,res,next)=>{
    
    const rider = await Rider.findById( req.params.id );
    if (!rider) return res.status(404).json({ error: "Rider does not exist" });
    
    const existing_transits_length = rider.allocatedTransits.length ? true : false; //single dimensional
    if (!existing_transits_length) return res.status(404).send.json({ error: "Empty transits. Contact Admin" }) 
    
    const existing_transits = rider.allocatedTransits

    const transitId = req.params.transitId;
    
    //check if transitId is in assigned array
    transitId_index = existing_transits.indexOf(transitId) >= 0;
    if (!transitId_index) return res.status(404).json({ error: "Bad request" })

    const transit = await Transit.findById( transitId );
    if (!transit) return res.status(404).json({ error: "Transit does not exist" });

  try {
    const updatedRider = await Rider.findByIdAndUpdate( req.params.id, { 
        currentTransit: transitId,
        currentTransit_type: transit.transitType
    },
    //   { $set: req.body },
    { new: true }
    );

    //update transit
    await Transit.findByIdAndUpdate( req.params.transitId, { 
        isCurrentlyInUse: true
    },
    //   { $set: req.body },
    { new: true }
    );
    res.status(200).json(updatedRider);
  } catch (err) {
    next(err);
  }
}

//remover transit from rider
const removeTransit = async (req,res,next)=>{
    const rider = await Rider.findById( req.params.id );
    if (!rider) return res.status(404).json({ error: "Rider does not exist" });
    
    const existing_transits_length = rider.allocatedTransits.length ? true : false;; //single dimensional
    if (!existing_transits_length) return res.status(404).send.json({ error: "Empty transits. Contact Admin" }) 
  
    const existing_transits = rider.allocatedTransits
    
    //transit to be removed
    const transitId = req.params.transitId;

    //check if transitId is in assigned array
    transitId_index = existing_transits.indexOf(transitId) >= 0;
    if (!transitId_index) return res.status(404).json({ error: "Bad request" })

    //check if transitId is rider currentTransit
    const currentTransit = rider.currentTransit == transitId ? "" : rider.currentTransit;
    const currentTransit_type = currentTransit == "" ? "" : rider.currentTransit_type;
    
    const transit = await Transit.findById( transitId );
    if (!transit) return res.status(404).json({ error: "Transit does not exist" });

  try {
    const updatedRider = await Rider.findByIdAndUpdate( req.params.id, { 
        $pull: { allocatedTransits: transitId },
        currentTransit: currentTransit,
        currentTransit_type: currentTransit_type
    },
    //   { $set: req.body },
    { new: true }
    );

    //update transit
    await Transit.findByIdAndUpdate( req.params.transitId, { 
        isCurrentlyInUse: rider._id == transit.riderId ?? false,
        riderId: rider._id == transit.riderId ?? "",
        isAssignedToRider: false
    },
    //   { $set: req.body },
    { new: true }
    );
    res.status(200).json({ updatedRider, message: "Transit removed from rider successfully", success: true });
  } catch (err) {
    next(err);
  }
}

const updateRider = async (req,res,next)=>{
    
  try {
    const updatedRider = await Rider.findByIdAndUpdate( req.params.id, 
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRider);
  } catch (err) {
    next(err);
  }
}

const deleteRider = async (req,res,next)=>{
  try {
    await Rider.findByIdAndDelete(req.params.id);
    res.status(200).json("Rider has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getRider = async (req,res,next)=>{
  try {
    const rider = await Rider.findById(req.params.id);
    res.status(200).json(rider);
  } catch (err) {
    next(err);
  }
}

//all riders
const getRiders = async (req,res,next)=>{
  try {
    const riders = await Rider.find();
    res.status(200).json(riders);
  } catch (err) {
    next(err);
  }
}

module.exports = { createRider, loginRider, cancelOrder, acceptOrder, enroutePickUp, enrouteDropOff, completeOrder,
                   assignTransits_to_Rider, switchTransit, removeTransit, updateRider, deleteRider, getRider, getRiders }