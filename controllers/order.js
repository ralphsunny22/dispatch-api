const Order = require("../models/Order");
const Parcel = require("../models/Parcel");
const Convey = require("../models/Convey");
const createError = require("../utils/error");
const PackageSummary = require("../models/PackageSummary");
const PayoutSummary = require("../models/PayoutSummary");
const ReceivePackage = require("../models/ReceivePackage");
const User = require("../models/User");
const SendPackage = require("../models/SendPacakage");

const createOrder = async (req, res, next) => {
    const userId = req.userTokenInfo.id;
    
    const randomTrackId = req.cookies.track_id;
    if (!randomTrackId) {
        return next(createError(401, "You cannot continue!"));
      }
    
    //validate trackId
    const packageSummary = await PackageSummary.findOne({ trackId: randomTrackId });
    if (!packageSummary) return next(createError(404, "Something went wrong!"));

    const payoutSummary = await PayoutSummary.findOne({ trackId: randomTrackId });
    if (!payoutSummary) return next(createError(404, "Something went wrong!"));

    const user = await User.findOne({ trackId: randomTrackId });
    if (!user) return next(createError(404, "Something went wrong!"));

    const parcel = await Parcel.findOne({ trackId: randomTrackId });
    if (!parcel) return next(createError(404, "Something went wrong!"));

    //amount
    const amount = payoutSummary.totalCost

    //sender
    const receivePackage = await ReceivePackage.findOne({ trackId: randomTrackId });
    const sender = [{
        address: receivePackage ? receivePackage.sender_pickUp_address : parcel.pickUp_address, 
        landmark: receivePackage ? receivePackage.sender_address_landmark : "", 
        phoneNumber: user.phoneNumber, 
    }]
    
    // return res.send(sender)

    //receiver
    const sendPackage = await SendPackage.findOne({ trackId: randomTrackId });
    const receiver = [{
        address: sendPackage.receiver_dropOff_address, 
        landmark: sendPackage.receiver_address_landmark, 
        phoneNumber: sendPackage.receiver_phoneNumber, 
    }]

    //product
    const product = [{
        category: packageSummary.category, 
        description: packageSummary.description, 
        estimated_weight: packageSummary.estimated_weight, 
        estimated_price: packageSummary.estimated_price, 
    }]

    const tripMode = payoutSummary.tripMode;
    const transitMeans = payoutSummary.transitMeans;
    const isInsured = payoutSummary.isInsured;
    const paymentMethod = payoutSummary.paymentMethod;
    
    //estimated cost
    const estimated_cost = packageSummary.estimated_cost;

    //duplicate order check
    const order = await Order.findOne({ trackId: randomTrackId });
    if (order) return next(createError(404, "Order is already placed!"));


    const newOrder = new Order({}); //req.bdoy is {}

    //append to array
    newOrder.amount = amount;
    newOrder.sender = sender;
    newOrder.receiver = receiver;
    newOrder.product = product;
    newOrder.tripMode = tripMode;
    newOrder.transitMeans = transitMeans;
    newOrder.isInsured = isInsured;
    newOrder.paymentMethod = paymentMethod;
    newOrder.userId = userId;
    newOrder.trackId = randomTrackId;

    try {
    const orderObj = await newOrder.save();
    res.status(200).json({ orderObj });
    
    } catch (err) {
    next(err);
    }

    

    
};

const updateOrder = async (req,res,next)=>{
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
}
const deleteOrder = async (req,res,next)=>{
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getOrder = async (req,res,next)=>{
  try {
    const user = await Order.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

//all
const getOrders = async (req,res,next)=>{
  try {
    const users = await Order.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, updateOrder, deleteOrder, getOrder, getOrders }