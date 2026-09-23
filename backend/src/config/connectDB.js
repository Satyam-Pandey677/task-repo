import mongoose from "mongoose"

export const connectDB = async () => {
    const connect = await mongoose.connect(`${process.env.MONGODB_KEY}/project3`)
    if(connect){
        console.log("connection successfull")
    }
}