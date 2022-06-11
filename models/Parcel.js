const mongoose = require("mongoose");
//model setup
const parcelSchema = new mongoose.Schema(
  {
    pickUp_address: { 
      type: String, 
      required: true,
      min:3 
    },
    dropOff_address: { 
        type: String, 
        required: true, 
        min:3 
    },
    userId: {
      type: String,
    },
    trackId: {
        type: String,
        unique: true,
    },
    
    status:{
      type: Boolean, default: true //incase user decides to cancel process
    },
    
  },
  { timestamps: true }
);

const Parcel = mongoose.model("Parcel", parcelSchema);
module.exports = Parcel;
// const _User = User;
// export { _User as User };
