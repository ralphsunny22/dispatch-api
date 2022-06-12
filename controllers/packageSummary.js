const PackageSummary = require("../models/PackageSummary");
const Parcel = require("../models/Parcel");
const Convey = require("../models/Convey");
const createError = require("../utils/error");

const createPackageSummary = async (req, res, next) => {
    const userId = req.userTokenInfo.id;
    
    const randomTrackId = req.cookies.track_id;
    if (!randomTrackId) {
        return next(createError(401, "You cannot continue!"));
      }
    
    //validate trackId
    const convey = await Convey.findOne({ trackId: randomTrackId });
    if (!convey) return next(createError(404, "Something went wrong!"));

    //calculate estimated cost
    const estimated_cost = 3500;

    //check if user is changing options
    const packageSummary = await PackageSummary.findOne({ trackId: randomTrackId });
    if (packageSummary) {
        //append new cost to array
        req.body.estimated_cost = estimated_cost
        try {
            const packageSummaryObj = await PackageSummary.findByIdAndUpdate(
                packageSummary._id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json({packageSummaryObj});
        } catch (err) {
            next(err);
        }
    } else {

        const newPackageSummary = new PackageSummary(req.body);

        //add to array
        newPackageSummary.estimated_cost = estimated_cost;
        newPackageSummary.userId = userId;
        newPackageSummary.trackId = randomTrackId;
    
        try {
        const packageSummaryObj = await newPackageSummary.save();
        res.status(200).json({ packageSummaryObj });
        
        } catch (err) {
        next(err);
        }

    }

    
  };

const updatePackageSummary = async (req,res,next)=>{
  try {
    const updatedPackageSummary = await PackageSummary.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPackageSummary);
  } catch (err) {
    next(err);
  }
}
const deletePackageSummary = async (req,res,next)=>{
  try {
    await PackageSummary.findByIdAndDelete(req.params.id);
    res.status(200).json("PackageSummary has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getPackageSummary = async (req,res,next)=>{
  try {
    const user = await PackageSummary.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

//all users
const getPackageSummaries = async (req,res,next)=>{
  try {
    const users = await PackageSummary.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createPackageSummary, updatePackageSummary, deletePackageSummary, getPackageSummary, getPackageSummaries }