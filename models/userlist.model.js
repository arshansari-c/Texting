import mongoose, { Schema } from "mongoose";

// Create schema with no defined fields (open structure)
const UserListSchema = new Schema({
    
}, { timestamps: true, strict: false });

// Export Mongoose model
export const UserList = mongoose.model("UserList", UserListSchema);
