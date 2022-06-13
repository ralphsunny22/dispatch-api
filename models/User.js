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
    
    role: { type: String, default: "subscriber" }, //rider, admin
    riderId: { type: String, default: "" },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
// const _User = User;
// export { _User as User };
