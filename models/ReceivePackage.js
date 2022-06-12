const mongoose = require("mongoose");
//model setup
const receivePackageSchema = new mongoose.Schema(
  {
    //parcel pickUp addr by default
    sender_pickUp_address: { 
      type: String, 
      required: true, 
    },
    sender_address_landmark: { 
        type: String, 
        required: true, 
    },
    receiver_phoneNumber: { 
        type: String, 
        required: true, 
    },
    
    userId: {
      type: String,
    },
    trackId: {
        type: String,
    },
    
    status:{
      type: Boolean, default: true //incase user decides to cancel process
    },
    
  },
  { timestamps: true }
);

const ReceivePackage = mongoose.model("ReceivePackage", receivePackageSchema);
module.exports = ReceivePackage;

