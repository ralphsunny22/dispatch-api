const Parcel = require("../models/Parcel");
const { randomUUID } = require('crypto');

const createParcel = async (req, res, next) => {
    const userId = req.params.userId;
    const newParcel = new Parcel(req.body);

    const randomTrackId = randomUUID();

    //add to array
    newParcel.userId = userId;
    newParcel.trackId = randomTrackId;
    // res.status(200).json({newParcel});
  
    try {
      const savedParcel = await newParcel.save();
      res
      .cookie("track_id", randomTrackId, {
        httpOnly: true,
      })
      .status(200)
      .json({ savedParcel });
      
    } catch (err) {
      next(err);
    }
  };

const updateParcel = async (req,res,next)=>{
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedParcel);
  } catch (err) {
    next(err);
  }
}
const deleteParcel = async (req,res,next)=>{
  try {
    await Parcel.findByIdAndDelete(req.params.id);
    res.status(200).json("Parcel has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getParcel = async (req,res,next)=>{
  try {
    const user = await Parcel.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

//all users
const getParcels = async (req,res,next)=>{
  try {
    const users = await Parcel.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createParcel, updateParcel, deleteParcel, getParcel, getParcels }