const mongoose = require("mongoose");
//model setup
const packageSummarySchema = new mongoose.Schema(
  {
    //id or string, id preferrably
    category: { 
      type: String, 
      required: true, 
    },
    description: { 
        type: String, 
        required: true,
        min: 3 
    },
    //wt of package
    estimated_weight: { 
        type: Number, 
        required: true, 
    },
    //totalprice of the package
    estimated_price: { 
        type: Number, 
        required: true, 
    },

    //dispatch estimated cost
    estimated_cost: { 
      type: Number, 
      default: 0, 
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

const PackageSummary = mongoose.model("PackageSummary", packageSummarySchema);
module.exports = PackageSummary;

