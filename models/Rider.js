const mongoose = require("mongoose");
//model setup
const userSchema = new mongoose.Schema(
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
    status:{
      type: Boolean, default: true
    },

    address: {
        type: String,
        required: true, //home address
    },

    transits:[String], //a driver can have multiple transits

    isCompany: { type: Boolean, default: false }, //if under a company
    company_name: {
        type: String,
        required: true, //company working for
    },
    isPrivate: { type: Boolean, default: true },
    
    isAdmin: { type: Boolean, default: false },

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
// const _User = User;
// export { _User as User };
