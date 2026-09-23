import { EMPLOYEE } from "../model/EmployeeModel.js";
import { ATTENDANCE } from "../model/AttendanceModel.js";



export const getMyProfile = async (req, res) => {
  try {

    const user = req.user.userId;
    const employee = await EMPLOYEE.findOne({ user }).populate("user", "email role");

    if (!employee) {
      throw new Error("Employee not found");
    }

    res.status(200).json({
      mesasge: "Profile fetched successfull",
      data: employee
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
     // Auth Middleware se logged-in user ki ID
    
    const { name, department, designation, phone } = req.body;

    // 1. Employee profile find karein
    let employee = await EMPLOYEE.findOne({ user:userId }).populate("user");

    console.log(employee)

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    // 2. Sirf employee profile fields update karein (jo provide ki gayi hain)
    if (name) employee.name = name;
    if (department) employee.department = department;
    if (designation) employee.designation = designation;
    if (phone) employee.phone = phone;

    const updatedEmployee = await employee.save();

    // 3. Updated profile fetch with user details (read-only email & role)
    const populatedProfile = await EMPLOYEE.findById(updatedEmployee._id).populate(
      "user",
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: populatedProfile,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

const getDayBounds = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const getCurrentEmployee = (req) => EMPLOYEE.findOne({ user: req.user.userId });

export const getTodayAttendance = async (req, res) => {
  console.log("enter")
  try {
    const employee = await getCurrentEmployee(req);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee profile not found" });
    }

    const { start, end } = getDayBounds();
    const attendance = await ATTENDANCE.findOne({
      employeeId: employee._id,
      date: { $gte: start, $lt: end },
    });

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const employee = await getCurrentEmployee(req);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee profile not found" });
    }

    const { start, end } = getDayBounds();
    const existingAttendance = await ATTENDANCE.findOne({
      employeeId: employee._id,
      date: { $gte: start, $lt: end },
    });

    if (existingAttendance) {
      return res.status(409).json({ success: false, message: "Attendance already marked for today", data: existingAttendance });
    }

    const attendance = await ATTENDANCE.create({
      employeeId: employee._id,
      status: "present",
      checkIn: new Date(),
    });

    return res.status(201).json({ success: true, message: "Check-in marked successfully", data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const employee = await getCurrentEmployee(req);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee profile not found" });
    }

    const { start, end } = getDayBounds();
    const attendance = await ATTENDANCE.findOne({
      employeeId: employee._id,
      date: { $gte: start, $lt: end },
    });

    if (!attendance) {
      return res.status(400).json({ success: false, message: "Please mark check-in first" });
    }
    if (attendance.checkOut) {
      return res.status(409).json({ success: false, message: "Check-out already marked for today", data: attendance });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    return res.status(200).json({ success: true, message: "Check-out marked successfully", data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};