import mongoose, { Schema } from "mongoose";

const attendaceShcema = new mongoose.Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: "EMPLOYEE",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },

    status: {
        type: String,
        enum: ["present", "absent"],
        default: "absent",
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
}, {
    timestamps: true,
});

export const ATTENDANCE = mongoose.model("ATTENDANCE", attendaceShcema)