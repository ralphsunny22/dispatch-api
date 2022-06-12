const mongoose = require("mongoose");
//model setup
const userSchema = new mongoose.Schema(
  {
    transitType: { 
      type: String, 
      required: true, //bike, tricycle, car
    },
    title: { 
        type: String, 
        required: true, //peugot car
      },
    dateManufactured: { 
        type: String, 
        required: true, //12-12-12
    },
    transitModel: { 
        type: String, 
        required: true, //honda
    },
    transitNumber: { 
        type: String, 
        required: true, //car number
    },
    isTinted: { 
        type: Boolean, 
        default: false,
    },
    description: { 
        type: String, 
        required: true, 
    },
    engineCapacity: {
      type: String,
      required: true,
    },
    mileage: {
        type: Number,
    },
    mileageUnit: {
        type: String,
    },
    maximumSpeed: {
        type: String,
        required: true,
    },
    actualOwner: {
        type: String,
        required: true,
    },
    riderId: {
        type: String,
    },
    transitPic: {
      type: String,
      default: "",
    },

    isCompany: { type: Boolean, default: false }, //if under a company
    company_name: {
        type: String,
        required: true, //company working for
    },
    isPrivate: { type: Boolean, default: true },
    status:{
      type: Boolean, default: true
    },

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
// const _User = User;
// export { _User as User };
