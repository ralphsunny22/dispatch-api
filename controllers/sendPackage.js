const SendPackage = require("../models/SendPacakage");
const Parcel = require("../models/Parcel");
const Convey = require("../models/Convey");
const createError = require("../utils/error");
const ReceivePackage = require("../models/ReceivePackage");

const createSendPackage = async (req, res, next) => {
    const userId = req.userTokenInfo.id;

    const randomTrackId = req.cookies.track_id;
    if (!randomTrackId) {
        return next(createError(401, "You cannot continue!"));
      }
    
    //validate trackId
    const convey = await Convey.findOne({ trackId: randomTrackId });
    if (!convey) return next(createError(404, "Something went wrong!"));

    const receivePackage = await ReceivePackage.findOne({ trackId: randomTrackId });
    const actionType = convey.actionType;
    if (actionType === "send package" || receivePackage) {

        //check if user is changing options
        const sendPackage = await SendPackage.findOne({ trackId: randomTrackId });
        if (sendPackage) {
            try {
                const sendPackageObj = await SendPackage.findByIdAndUpdate(
                    sendPackage._id,
                    { $set: req.body },
                    { new: true }
                );
                res.status(200).json({sendPackageObj});
            } catch (err) {
                next(err);
            }
        } else {

            const newSendPackage = new SendPackage(req.body);

            //add to array
            newSendPackage.userId = userId;
            newSendPackage.trackId = randomTrackId;
        
            try {
            const sendPackageObj = await newSendPackage.save();
            res.status(200).json({ sendPackageObj });
            
            } catch (err) {
            next(err);
            }

        }

    } else {
        return next(createError(401, "You cannot continue!"));
    }
  };

const updateSendPackage = async (req,res,next)=>{
  try {
    const updatedSendPackage = await SendPackage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedSendPackage);
  } catch (err) {
    next(err);
  }
}
const deleteSendPackage = async (req,res,next)=>{
  try {
    await SendPackage.findByIdAndDelete(req.params.id);
    res.status(200).json("SendPackage has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getSendPackage = async (req,res,next)=>{
  try {
    const user = await SendPackage.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

//all users
const getSendPackages = async (req,res,next)=>{
  try {
    const users = await SendPackage.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createSendPackage, updateSendPackage, deleteSendPackage, getSendPackage, getSendPackages }