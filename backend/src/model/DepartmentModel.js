import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type:String,
        trim:true,
        required: true,
        maxLength:32,
        unique:true
    }
},{
    timestamps:true
})


export const DEPARTMENT = mongoose.model("DEPARTMENT", departmentSchema)