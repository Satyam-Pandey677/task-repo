import mongoose, { Schema } from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        required: true,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"USER"
    },
    name:{
        type: String,
    },
    phone: {
        type: String,
        trim: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "DEPARTMENT"
    },
    designation: {
        type: String,
        required: true
    },
    joiningDate:{
        type: String,
        required: true
    },
    salary:{
        type: Number,
        required: true
    },
    status:{
        type:String,
        enum: ["Active", "Resigned"]
    },
},{
    timestamps:true
})

export const EMPLOYEE = mongoose.model("EMPLOYEE", employeeSchema);