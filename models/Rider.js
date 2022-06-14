const mongoose = require("mongoose");
//model setup
const riderSchema = new mongoose.Schema(
  {
    firstname: { 
      type: String, 
      required: true, 
    },
    lastname: { 
        type: String, 
        required: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true, minlength: 6 },
    profilePic: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true, //home address
    },

    currentGeoLocation: {
      type: String,
      default: "",
    },

    currentTransit: {
      type: String, //current bike/tricycle/car rider is using
      default: ""
    },
    currentTransit_type: {
      type: String, //bike, tricycle, car. mainly for queries
      default: ""
    },
    allocatedTransits:[String], //a driver can have multiple transits, for switching

    ///////updated once subscriber clicks on place-order/////////////
    isAvailableForOrder: { type: Boolean, default: true },
    pendingOrderId: {
      type: String, //from orders table
      default: ""
    },
    /////////////////////
    hasAcceptedOrder: { type: Boolean, default: false }, //true
    acceptedOrderId: {
      type: String, //from pendingOrderId
      default: ""
    },

    enroutePickUp: { type: Boolean, default: false }, //true
    enrouteDropOff: { type: Boolean, default: false }, //true

    completedOrders: [{ orderId: String,
                        from: String,
                        to: String,
                        client: [{ name: String, email: String, phone: String, remarks: { type: String, default: "" } }],
                        isInsured: false,
                        tripMode: String,
                        payment: [{ method: String, isPaid: false, amount: Number }]
                       }],
    //cancelledOrders: [String],

    hasCancelledOrder: { type: Boolean, default: false }, //true
    cancelledOrders: [{ orderId: String, status: {type: String, default: "pending"},
                        reason: [{ client: {type: String, default: ""}, rider: {type: String, default: ""} }] }],

    isCompany: { type: Boolean, default: false }, //if under a company
    company_name: {
        type: String,//company working for    
    },
    isPrivate: { type: Boolean, default: true },

    status:{
      type: Boolean, default: true
    },
    
  },
  { timestamps: true }
);

const Rider = mongoose.model("Rider", riderSchema);
module.exports = Rider;
// const _Rider = Rider;
// export { _Rider as Rider };
