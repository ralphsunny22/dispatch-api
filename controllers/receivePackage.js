const ReceivePackage = require("../models/ReceivePackage");
const Parcel = require("../models/Parcel");
const Convey = require("../models/Convey");
const createError = require("../utils/error");

const createReceivePackage = async (req, res, next) => {
    const userId = req.userTokenInfo.id;
    
    const randomTrackId = req.cookies.track_id;
    if (!randomTrackId) {
        return next(createError(401, "You cannot continue!"));
      }
    
    //validate trackId
    const convey = await Convey.findOne({ trackId: randomTrackId });
    if (!convey) return next(createError(404, "Something went wrong!"));

    const actionType = convey.actionType;
    if (actionType === "receive package") {

        //check if user is changing options
        const receivePackage = await ReceivePackage.findOne({ trackId: randomTrackId });
        if (receivePackage) {
            try {
                const receivePackageObj = await ReceivePackage.findByIdAndUpdate(
                    receivePackage._id,
                    { $set: req.body },
                    { new: true }
                );
                res.status(200).json({receivePackageObj});
            } catch (err) {
                next(err);
            }
        } else {

            const newReceivePackage = new ReceivePackage(req.body);

            //add to array
            newReceivePackage.userId = userId;
            newReceivePackage.trackId = randomTrackId;
        
            try {
            const receivePackageObj = await newReceivePackage.save();
            res.status(200).json({ receivePackageObj });
            
            } catch (err) {
            next(err);
            }

        }

    } else {
        return next(createError(401, "You cannot continue!"));
    }
  };

const updateReceivePackage = async (req,res,next)=>{
  try {
    const updatedReceivePackage = await ReceivePackage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedReceivePackage);
  } catch (err) {
    next(err);
  }
}
const deleteReceivePackage = async (req,res,next)=>{
  try {
    await ReceivePackage.findByIdAndDelete(req.params.id);
    res.status(200).json("ReceivePackage has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getReceivePackage = async (req,res,next)=>{
  try {
    const user = await ReceivePackage.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

//all users
const getReceivePackages = async (req,res,next)=>{
  try {
    const users = await ReceivePackage.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createReceivePackage, updateReceivePackage, deleteReceivePackage, getReceivePackage, getReceivePackages }