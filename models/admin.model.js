import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,    // optional but recommended to avoid duplicates
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type : String,
    required : true,
    enum : ["admin","superAdmin"]
  }
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
