import mongoose from 'mongoose'
export const mongodb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connect succesfully")
    } catch (error) {
        console.log("Mongodb error",error)
    }
}