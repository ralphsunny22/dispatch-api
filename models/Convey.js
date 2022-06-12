const mongoose = require("mongoose");
//model setup
const conveySchema = new mongoose.Schema(
  {
    estimated_distance: { 
      type: String, 
      required: true, 
    },
    estimated_duration: { 
        type: String, 
        required: true, 
    },
    transitMeans: { 
        type: String, 
        required: true, //bike, tricycle, car 
    },
    transit_logo: { 
        type: String,
        default:"" 
    },
    actionType: {
        type: String,
        default:"send package" //receive package 
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

const Convey = mongoose.model("Convey", conveySchema);
module.exports = Convey;

