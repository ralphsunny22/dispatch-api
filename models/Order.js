const mongoose = require("mongoose");
//model setup
const orderSchema = new mongoose.Schema(
  {
    //total cost
    amount: { 
      type: Number, 
      default: 0, 
    },
    //address
    sender: [
        {
            address: { type:String },
            landmark: { type:String, default:"" },
            phoneNumber: { type:Number }
        }
    ],
    receiver: [
        {
            address: { type:String },
            landmark: { type:String },
            phoneNumber: { type:Number }
        }
    ],

    product: [
        {
            category: { type:String },
            description: { type:String },
            estimated_weight: { type:Number },
            estimated_price: { type:Number },
        }
    ],

    tripMode: { 
        type: String, 
    },
    transitMeans: { 
        type: String, 
    },
    isInsured: { 
        type: Boolean,
        default: false 
    },
    
    paymentMethod: { 
        type: String, 
        required: true,
        default:"wallet" // card, cash, on-delivery
    },
    isPaid: { 
        type: Boolean, 
        default:false
    },
    
    userId: {
      type: String,
    },
    trackId: {
        type: String,
    },

    isAssignedRider: {
        type: Boolean,
        default: false
    },
    riderId: {
        type: String, //rider id picked
        default:""
    },
    riderAccepted: {
        type: Boolean,
        default: false //after rider clicks on accept
    },
    riderOnPickUp: {
        type: Boolean,
        default: false //after rider clicks on accept
    },
    riderOnDropOff: {
        type: Boolean,
        default: false //after rider clicks on accept
    },

    riderCompleted: {
        type: Boolean,
        default: false //after rider clicks on complete i.e final btn
    },

    status:{
      type: String, default: "pending" //onTransit, completed, cancelled
    },
    
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

