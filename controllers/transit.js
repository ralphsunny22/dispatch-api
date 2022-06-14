const Rider = require("../models/Rider");
const Transit = require("../models/Transit");
const createError = require("../utils/error");

const createTransit = async (req, res, next) => {
    const userId = req.userTokenInfo.id; //from verifyToken.js
    /// return res.send(userId);

    // const transit = Transit.findOne({ transitNumber: req.body.transitNumber })
    // if (transit) return next(createError(404, "Transit Already Exist!"));
    
    //create new
    const newTransit = new Transit(req.body);

    ///add to array
    newTransit.created_by = userId;
    
    try {
      const savedTransit = await newTransit.save();
      res.status(200).json({ savedTransit, success:true });
      
    } catch (err) {
      next(err);
    }
};

//remover transit from rider to another
const transferTransit = async (req,res,next)=>{
  const fromRider = await Rider.findById( req.params.fromRiderId );
  if (!fromRider) return res.status(404).json({ error: "Rider does not exist" });

  const toRider = await Rider.findById( req.params.toRiderId );
  if (!toRider) return res.status(404).json({ error: "Rider you're transferring to, does not exist" });
  
  const fromRider_existing_transits = fromRider.allocatedTransits.length ? true : false; //single dimension
  //return res.send({fromRider_existing_transits})
  if (!fromRider_existing_transits) return res.status(500).json({ error: "Bad Request" })
   
  //transitId to be transferred
  const transitId = req.params.id;

  const toRider_existing_transits_index = toRider.allocatedTransits ?? toRider.allocatedTransits.indexOf(transitId) >= 0; //arr1
  if (toRider_existing_transits_index === true) return res.status(404).json({ error: "Receiver already has this transit" })
  
  //check if transitId is fromRider currentTransit
  const fromRider_currentTransit = fromRider.currentTransit == transitId ? "" : fromRider.currentTransit;
  const fromRider_currentTransit_type = fromRider_currentTransit == "" ? "" : fromRider.currentTransit_type;
  
  const transit = await Transit.findById( transitId );
  if (!transit) return res.status(404).json({ error: "Transit does not exist" });

try {
  const updated_fromRider = await Rider.findByIdAndUpdate( req.params.fromRiderId, { 
      $pull: { allocatedTransits: transitId },
      currentTransit: fromRider_currentTransit,
      currentTransit_type: fromRider_currentTransit_type
  },
  //   { $set: req.body },
  { new: true }
  );

  const updated_toRider = await Rider.findByIdAndUpdate( req.params.toRiderId, { 
      $push: { allocatedTransits: transitId },
  },
  //   { $set: req.body },
  { new: true }
  );

  //update transit
  await Transit.findByIdAndUpdate( req.params.transitId, { 
      isCurrentlyInUse: req.params.fromRiderId == transit.riderId ?? false,
      riderId: req.params.fromRiderId == transit.riderId ?? "",
      isAssignedToRider: false
  },
  //   { $set: req.body },
  { new: true }
  );
  res.status(200).json({ fromRider: updated_fromRider, toRider: updated_toRider, message: "Transit transferred successfully", success: true });
} catch (err) {
  next(err);
}
}

const updateTransit = async (req,res,next)=>{
  try {
    const updatedTransit = await Transit.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTransit);
  } catch (err) {
    next(err);
  }
}
const deleteTransit = async (req,res,next)=>{
  try {
    await Transit.findByIdAndDelete(req.params.id);
    res.status(200).json("Transit has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getTransit = async (req,res,next)=>{
  try {
    const user = await Transit.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

//all users
const getTransits = async (req,res,next)=>{
  try {
    const users = await Transit.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createTransit, transferTransit, updateTransit, deleteTransit, getTransit, getTransits }