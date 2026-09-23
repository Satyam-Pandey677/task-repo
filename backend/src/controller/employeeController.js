import { EMPLOYEE } from "../model/EmployeeModel.js";
import { ATTENDANCE } from "../model/AttendanceModel.js";



export const getMyProfile = async (req, res) => {
  try {

    const user = req.user.userId;
    const employee = await EMPLOYEE.findOne({ user })
      .populate("user", "email role")
      .populate("department", "name");

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

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await EMPLOYEE.find({})
      .populate("user", "email role")
      .populate("department", "name");

    return res.status(200).json({
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
     
    const { name, department, designation, phone } = req.body;

    let employee = await EMPLOYEE.findOne({ user:userId }).populate("user");

    console.log(employee)

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    if (name) employee.name = name;
    if (department) employee.department = department;
    if (designation) employee.designation = designation;
    if (phone) employee.phone = phone;

    const updatedEmployee = await employee.save();

    const populatedProfile = await EMPLOYEE.findById(updatedEmployee._id).populate(
      "user",
    );

    return res.status(200).json({
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

const formatTime = (date) => {
  if (!date) return "--";
  const value = new Date(date);
  return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return "--";

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end - start;
  const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

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

    return res.status(200).json({ data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAttendanceStats = async (req, res) => {
  try {
    const employee = await getCurrentEmployee(req);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee profile not found" });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const records = await ATTENDANCE.find({
      employeeId: employee._id,
      date: { $gte: monthStart, $lt: monthEnd },
    });

    let workingDays = 0;
    for (let day = new Date(monthStart); day <= now; day.setDate(day.getDate() + 1)) {
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        workingDays += 1;
      }
    }

    const presentDays = records.filter((record) => record.status === "present" || record.checkIn).length;
    const attendancePercentage = workingDays
      ? Math.min(100, Math.round((presentDays / workingDays) * 100))
      : 0;

    return res.status(200).json({
      attendancePercentage,
      presentDays,
      workingDays,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendanceRecords = async (req, res) => {
  try {
    const { start, end } = getDayBounds();
    const attendanceQuery = {
      date: { $gte: start, $lt: end },
    };

    if (req.user.role === "employee") {
      const employee = await getCurrentEmployee(req);
      if (!employee) {
        return res.status(404).json({ success: false, message: "Employee profile not found" });
      }
      attendanceQuery.employeeId = employee._id;
    }

    const records = await ATTENDANCE.find(attendanceQuery).populate({
      path: "employeeId",
      select: "name department employeeID",
      populate: { path: "department", select: "name" },
    });

    const attendanceList = records.map((record) => {
      const employee = record.employeeId || {};
      const checkIn = record.checkIn ? new Date(record.checkIn) : null;
      const checkOut = record.checkOut ? new Date(record.checkOut) : null;
      const isLate = checkIn && (checkIn.getHours() > 9 || (checkIn.getHours() === 9 && checkIn.getMinutes() > 30));

      let status = "Present";
      if (!checkIn && record.status === "absent") {
        status = "On leave";
      } else if (isLate) {
        status = "Late";
      }

      return {
        name: employee.name || "Unknown Employee",
        department: employee.department?.name || employee.department || "Unassigned",
        date: new Date(record.date).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
        checkIn: formatTime(checkIn),
        checkOut: formatTime(checkOut),
        hours: formatHours(checkIn, checkOut),
        status,
      };
    });

    return res.status(200).json({
      data: attendanceList,
    });
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

    return res.status(201).json({ message: "Check-in marked successfully", data: attendance });
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

    return res.status(200).json({ message: "Check-out marked successfully", data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};