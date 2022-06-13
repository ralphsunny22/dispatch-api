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

module.exports = { createTransit, updateTransit, deleteTransit, getTransit, getTransits }