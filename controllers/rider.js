const Rider = require("../models/Rider");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("../utils/error");
const Order = require("../models/Order");

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

    try {
      const updatedRider = await Rider.findByIdAndUpdate( riderId, 
        { isAvailableForOrder: true, pendingOrderId: "" },
      );
      //update order
      await Order.findByIdAndUpdate( orderId, 
        { isAssignedRider: false, riderId: "" },
      );
      res.status(200).json(updatedRider);
    } catch (err) {
      next(err);
    }
  }

//assign transits, to riders
const assignTransits_to_Rider = async (req,res,next)=>{
    const rider = await Rider.findById( req.params.id );
    const transits = rider[0].transits;
    const arr2 = req.body.transits;

    //compare old & new copy
    const found = transits.some(r => arr2.includes(r))
    if (found) return next(createError(404, "Duplicate Transits Not Allowed!"));
  try {
    const updatedRider = await Rider.findByIdAndUpdate( req.params.id, { 
        // $push: { rider.transits: req.body.transits }
    },
    //   { $set: req.body },
    //   { new: true }
    );
    res.status(200).json(updatedRider);
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

module.exports = { createRider, loginRider, cancelOrder, assignTransits_to_Rider, updateRider, deleteRider, getRider, getRiders }