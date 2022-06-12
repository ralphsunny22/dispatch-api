const PayoutSummary = require("../models/PayoutSummary");
const Parcel = require("../models/Parcel");
const Convey = require("../models/Convey");
const createError = require("../utils/error");
const PackageSummary = require("../models/PackageSummary");

const createPayoutSummary = async (req, res, next) => {
    const userId = req.userTokenInfo.id;
    
    const randomTrackId = req.cookies.track_id;
    if (!randomTrackId) {
        return next(createError(401, "You cannot continue!"));
      }
    
    //validate trackId
    const packageSummary = await PackageSummary.findOne({ trackId: randomTrackId });
    if (!packageSummary) return next(createError(404, "Something went wrong!"));

    //estimated cost
    const estimated_cost = packageSummary.estimated_cost;

    //cal total cost
    const isInsured = req.body.isInsured;
    const tripMode = req.body.tripMode;

    const isInsuredCost = isInsured ? 0.01 * estimated_cost : 0;
    const tripModeCost = tripMode == "two-way-trip" ? estimated_cost : 0; //add another est_cost

    const totalCost = estimated_cost + isInsuredCost + tripModeCost;
    // return res.send({totalCost})
    
    //check if user is changing options
    const payoutSummary = await PayoutSummary.findOne({ trackId: randomTrackId });
    if (payoutSummary) {
        //append new cost to array
        req.body.totalCost = totalCost
        try {
            const payoutSummaryObj = await PayoutSummary.findByIdAndUpdate(
                payoutSummary._id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json({payoutSummaryObj});
        } catch (err) {
            next(err);
        }
    } else {

        const newPayoutSummary = new PayoutSummary(req.body);

        //append to array
        newPayoutSummary.totalCost = totalCost;
        newPayoutSummary.userId = userId;
        newPayoutSummary.trackId = randomTrackId;
    
        try {
        const payoutSummaryObj = await newPayoutSummary.save();
        res.status(200).json({ payoutSummaryObj });
        
        } catch (err) {
        next(err);
        }

    }

    
  };

const updatePayoutSummary = async (req,res,next)=>{
  try {
    const updatedPayoutSummary = await PayoutSummary.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPayoutSummary);
  } catch (err) {
    next(err);
  }
}
const deletePayoutSummary = async (req,res,next)=>{
  try {
    await PayoutSummary.findByIdAndDelete(req.params.id);
    res.status(200).json("PayoutSummary has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getPayoutSummary = async (req,res,next)=>{
  try {
    const user = await PayoutSummary.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

//all users
const getPayoutSummaries = async (req,res,next)=>{
  try {
    const users = await PayoutSummary.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createPayoutSummary, updatePayoutSummary, deletePayoutSummary, getPayoutSummary, getPayoutSummaries }