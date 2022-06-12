const mongoose = require("mongoose");
//model setup
const transactionSchema = new mongoose.Schema(
  {
    //wallet, card, cash, on-delivery
    paymentMethod: { 
      type: String,  
    },

    amountTransacted: { 
        type: Number, 
        min: 0,
        default: 0, 
      },

    ///credit or debit
    transactionType: { 
        type: String,
        default:"" 
    },

    description: { 
        type: String, //credited via paystack
        default:"" 
    },

    orderId: { 
        type: String, //if debited after placing order 
        default:"" 
    },
    
    userId: {
      type: String,
    },
    // trackId: {
    //     type: String,
    // },

    status:{
      type: Boolean, default: true //
    },
    
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;

