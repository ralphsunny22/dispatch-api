const Wallet = require("../models/Wallet");
const createError = require("../utils/error");

//credit
const creditWallet = async (req,res,next)=>{
    const userId = req.userTokenInfo.id;

    const amountTransacted = req.body.amountTransacted;
    if (amountTransacted == 0 || amountTransacted < 1) return next(createError(404, "Something went wrong!"));

    const lastRecord = await Wallet.find({ userId:userId }).sort({ _id:-1 }).limit(1);
    if (!lastRecord) return next(createError(404, "User does not have wallet"));
    
    const currentBalance = lastRecord[0].currentBalance;
    //return res.send({currentBalance})
    const newCurrentBalance = currentBalance == 0 ? amountTransacted : currentBalance + amountTransacted;
    
    const newWallet = new Wallet({
        amountTransacted: amountTransacted,
        transactionType: "credit",
        transactionDescription: "Funded wallet via payment system",
        currentBalance: newCurrentBalance,
        userId: userId,
    })

    try {
        const walletObj = await newWallet.save();
        res.status(200).json({ walletObj });
        
        } catch (err) {
        next(err);
        }
}

//debit
const debitWallet = async (req,res,next)=>{
    const userId = req.userTokenInfo.id;

    const amountTransacted = req.body.amountTransacted;
    if (amountTransacted == 0 || amountTransacted < 1) return next(createError(404, "Something went wrong!"));

    const lastRecord = await Wallet.find({ userId:userId }).sort({ _id:-1 }).limit(1);
    if (!lastRecord) return next(createError(404, "User does not have wallet"));
    
    const currentBalance = lastRecord[0].currentBalance;
    if (currentBalance < amountTransacted) return next(createError(404, "Wallet Insufficient Fund"));

    //return res.send({currentBalance})
    const newCurrentBalance = currentBalance - amountTransacted;
    
    const newWallet = new Wallet({
        amountTransacted: amountTransacted,
        transactionType: "debit",
        transactionDescription: "Debit wallet transaction",
        currentBalance: newCurrentBalance,
        userId: userId,
    })

    try {
        const walletObj = await newWallet.save();
        res.status(200).json({ walletObj });
        
        } catch (err) {
        next(err);
        }
}

const updateWallet = async (req,res,next)=>{
  try {
    const updatedWallet = await Wallet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedWallet);
  } catch (err) {
    next(err);
  }
}
const deleteWallet = async (req,res,next)=>{
  try {
    await Wallet.findByIdAndDelete(req.params.id);
    res.status(200).json("Wallet has been deleted.");
  } catch (err) {
    next(err);
  }
}
const getWallet = async (req,res,next)=>{
  try {
    const wallet = await Wallet.findById(req.params.id);
    res.status(200).json(wallet);
  } catch (err) {
    next(err);
  }
}

//all wallets
const getWallets = async (req,res,next)=>{
  try {
    const wallets = await Wallet.find();
    res.status(200).json(wallets);
  } catch (err) {
    next(err);
  }
}

module.exports = { creditWallet, debitWallet, updateWallet, deleteWallet, getWallet, getWallets }