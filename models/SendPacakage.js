const mongoose = require("mongoose");
//model setup
const sendPackageSchema = new mongoose.Schema(
  {
    //parcel dropOff addr by default
    receiver_dropOff_address: { 
      type: String, 
      required: true, 
    },
    receiver_address_landmark: { 
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

const SendPackage = mongoose.model("SendPackage", sendPackageSchema);
module.exports = SendPackage;

