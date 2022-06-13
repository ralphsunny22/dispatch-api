const Rider = require("../models/Rider");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const createError = require("../utils/error");

const createRider = async (req, res, next) => {
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    //create new
    const newRider = new Rider({
        address: req.body.address,
        isCompany: req.body.isCompany,
        companyName: req.body.companyName ? req.body.companyName : "",
        isPrivate: req.body.isPrivate
    });

    //copy reqs, hash password
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        phoneNumber: req.body.phoneNumber,
      });

    try {
      const savedRider = await newRider.save();
      //res.status(200).json({ savedRider, success:true });

      newUser.role = "rider"
      newUser.riderId = savedRider._id
      await newUser.save();
      res.status(200).send("Rider has been created successfully.");
      
    } catch (err) {
      next(err);
    }
  };

const updateRider = async (req,res,next)=>{
  try {
    const updatedRider = await Rider.findByIdAndUpdate(
      req.params.id,
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

module.exports = { createRider, updateRider, deleteRider, getRider, getRiders }