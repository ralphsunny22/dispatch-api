const mongoose = require("mongoose");
//model setup
const riderSchema = new mongoose.Schema(
  {
    address: {
        type: String,
        required: true, //home address
    },

    //transits:[String], //a driver can have multiple transits

    isPrivate: { type: Boolean, default: true },
    isCompany: { type: Boolean, default: false }, //if under a company
    companyName: {
        type: String,
        default: ""
    },
    
    
  },
  { timestamps: true }
);

const Rider = mongoose.model("Rider", riderSchema);
module.exports = Rider;
// const _Rider = Rider;
// export { _Rider as Rider };
