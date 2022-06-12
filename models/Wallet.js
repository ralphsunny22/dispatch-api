const mongoose = require("mongoose");
//model setup
const walletSchema = new mongoose.Schema(
  {
    //amt coming or leaving the wallet
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

    transactionDescription: { 
        type: String, //credited via paystack
        default:"" 
    },

    currentBalance: { 
        type: Number, 
        default: 0, 
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

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;

