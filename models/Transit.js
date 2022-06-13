const mongoose = require("mongoose");
//model setup
const transitSchema = new mongoose.Schema(
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
        unique: true
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
    // riderId: {
    //     type: String,
    //     default: "",
    // },
    transitPic: {
      type: String,
      default: "",
    },

    created_by: {
      type: String, //auth-user-id
    },

    isCompany: { type: Boolean, default: false }, //if under a company
    company_name: {
        type: String,
        default: "",
    },
    isPrivate: { type: Boolean, default: true },
    status:{
      type: Boolean, default: true
    },

  },
  { timestamps: true }
);

const Transit = mongoose.model("Transit", transitSchema);
module.exports = Transit;
// const _Transit = Transit;
// export { _Transit as Transit };
