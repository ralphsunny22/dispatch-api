const Convey = require("../models/Convey");
const { randomUUID } = require('crypto');
const Parcel = require("../models/Parcel");

const createConvey = async (req, res, next) => {
    const userId = req.userTokenInfo.id;

    const randomTrackId = req.cookies.track_id;
    if (!randomTrackId) {
        return next(createError(401, "You cannot continue!"));
      }
    //return res.send(randomTrackId);

    //validate trackId
    const parcel = await Parcel.findOne({ trackId: randomTrackId });
    if (!parcel) return next(createError(404, "Something went wrong!"));

    //check if user is changing options
    const convey = await Convey.findOne({ trackId: randomTrackId });
    //return res.send(convey);
    if (convey) {
        try {
            const conveyObj = await Convey.findByIdAndUpdate(
                convey._id,
                { $set: req.body },
                { new: true }
              );
              res.status(200).json({conveyObj});
        } catch (err) {
            next(err);
        }
    } else {

        const newConvey = new Convey(req.body);

        //add to array
        newConvey.userId = userId;
        newConvey.trackId = randomTrackId;
        // res.status(200).json({newConvey});
    
        try {
        const conveyObj = await newConvey.save();
        res.status(200).json({ conveyObj });
        
        } catch (err) {
        next(err);
        }

    }
  };

const updateConvey = async (req,res,next)=>{
  try {
    const updatedConvey = await Convey.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedConvey);
  } catch (err) {
    next(err);
  }
}
const deleteConvey = async (req,res,next)=>{
  try {
    await Convey.findByIdAndDelete(req.params.id);
    res.status(200).json("Convey has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getConvey = async (req,res,next)=>{
  try {
    const user = await Convey.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

//all users
const getConveys = async (req,res,next)=>{
  try {
    const users = await Convey.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createConvey, updateConvey, deleteConvey, getConvey, getConveys }