import mongoose, { Schema } from "mongoose";

// Create schema with no defined fields (open structure)
const ComfirmListSchema = new Schema({
    original_id:{
        type : mongoose.Schema.ObjectId,
        ref : "UserList"
    }
}, { timestamps: true, strict: false });

// Export Mongoose model
export const ConfirmList = mongoose.model("ConfirmList", ComfirmListSchema);
