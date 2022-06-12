const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const createError = require("../utils/error");
const jwt = require("jsonwebtoken");
const Wallet = require("../models/Wallet");

const register = async (req, res, next) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      
      //copy reqs, hash password
      const newUser = new User({
        ...req.body,
        password: hash,
      });
  
      await newUser.save();
      res.status(200).send("User has been created successfully.");
    } catch (err) {
      next(err);
    }
};

const login = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return next(createError(404, "User not found!"));
  
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Wrong Credentials Provided"));
  
      //generate token, after comparing possible outcomes
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin }, //'id' will use to verifyUser Token later
        process.env.JWT_SECRET_KEY
      );

      const wallet = await Wallet.findOne({ userId: user._id });
      if (!wallet) {
        //create user wallet
        const newWallet = new Wallet({
          userId: user._id
        });
        await newWallet.save();
      }
      
      //excluding some returned values to client-side
      const { password, isAdmin, ...otherDetails } = user._doc;
    //   res.status(200).json({...otherDetails});
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
      next(err);
    }
  };

  module.exports = { register, login }