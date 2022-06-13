const Order = require("../models/Order");
const Parcel = require("../models/Parcel");
const Convey = require("../models/Convey");
const createError = require("../utils/error");
const PackageSummary = require("../models/PackageSummary");
const PayoutSummary = require("../models/PayoutSummary");
const ReceivePackage = require("../models/ReceivePackage");
const User = require("../models/User");
const SendPackage = require("../models/SendPacakage");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const Rider = require("../models/Rider");

const createOrder = async (req, res, next) => {
    const userId = req.userTokenInfo.id;
    
    const randomTrackId = req.cookies.track_id;
    if (!randomTrackId) {
        return next(createError(401, "You cannot continue!"));
      }
    
    //validate trackId
    const payoutSummary = await PayoutSummary.findOne({ trackId: randomTrackId });
    if (!payoutSummary) return next(createError(404, "Something went wrong!"));

    //amount
    const amount = payoutSummary.totalCost
    const paymentMethod = payoutSummary.paymentMethod;

    //check wallet to store transaction
    const lastRecord = await Wallet.find({ userId:userId }).sort({ _id:-1 }).limit(1);
    if (!lastRecord) return next(createError(404, "User does not have wallet"));

    const currentBalance = lastRecord[0].currentBalance;
    if (paymentMethod == "wallet" && currentBalance < amount) return next(createError(404, "Wallet Insufficient Fund"));
    
    const packageSummary = await PackageSummary.findOne({ trackId: randomTrackId });
    if (!packageSummary) return next(createError(404, "Something went wrong!"));

    const user = await User.findOne({ trackId: randomTrackId });
    if (!user) return next(createError(404, "Something went wrong!"));

    const parcel = await Parcel.findOne({ trackId: randomTrackId });
    if (!parcel) return next(createError(404, "Something went wrong!"));

    

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

    //create new transaction
    const newTransaction = new Transaction({
      paymentMethod: paymentMethod,
      amountTransacted: amount,
      transactionType: "Debit",
      description: "Debit via "+ paymentMethod,
      orderId: orderObj._id,
      userId: userId,
   })
   const transactionObj = await newTransaction.save();

    if (paymentMethod == "wallet") {
      const newWallet = new Wallet({
        amountTransacted: amount,
        transactionType: "debit",
        transactionDescription: "Debit wallet transaction",
        currentBalance: currentBalance - amount,
        transactionId: transactionObj._id,
        orderId: orderObj._id,
        userId: userId,
     })
     const walletObj = await newWallet.save();
    }


    res.status(200).json({ orderObj });
    
    } catch (err) {
    next(err);
    }

    

    
};

//assign rider to your placed order
const assignRider_to_Order = async (req,res,next)=>{

  const riderId = req.body.riderId
  
  const order = await Order.findById(req.params.id);

  //check is rider is already assigned
  if (order.riderId == riderId) return res.status(400).json({ error:"Rider will respond soon", success:false});

  //check is abother rider is been assigned, when previous one is still active
  if (order.isAssignedRider) return res.status(400).json({ error:"To assign another rider, tell the previone rider to cancel request", success:false});

  //append to array
  req.body.isAssignedRider = true

  //update selected rider

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      
      { $set: req.body },
      { new: true }
    );

    const updatedRider = await Rider.findByIdAndUpdate(
      riderId,
      { isAvailableForOrder: false, pendingOrderId: order._id },
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
}

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
const getUserOrders = async (req,res,next)=>{
  const userId = req.userTokenInfo.id;
    
  const randomTrackId = req.cookies.track_id;
  if (!randomTrackId) {
      return next(createError(401, "You cannot continue!"));
    }
  try {
    const orders = await Order.find({ userId: userId });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

//all
const getOrders = async (req,res,next)=>{
  try {
    const orders = await Order.find({ userId: userId });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, assignRider_to_Order, updateOrder, deleteOrder, getOrder, getUserOrders, getOrders }