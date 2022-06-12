const mongoose = require("mongoose");
//model setup
const payoutSummarySchema = new mongoose.Schema(
  {
    //if true, add 1% to the est_cost from packageSummary
    isInsured: { 
      type: Boolean, 
      default: false, 
    },
    tripMode: { 
        type: String, 
        required: true,
        default: "one-way-trip" //two-way-trip doubles the est_cost 
    },
    
    //final cost for disptch
    totalCost: { 
        type: Number, 
        min: 0
    },
    paymentMethod: { 
        type: String, 
        required: true,
        default:"wallet" // card, cash, on-delivery
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

const PayoutSummary = mongoose.model("PayoutSummary", payoutSummarySchema);
module.exports = PayoutSummary;

