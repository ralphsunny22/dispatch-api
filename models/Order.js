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

    riderId: {
        type: String //rider id picked
    },
    
    status:{
      type: String, default: "pending" //onTransit, completed, cancelled
    },
    
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

