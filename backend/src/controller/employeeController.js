import { EMPLOYEE } from "../model/EmployeeModel.js";
import { ATTENDANCE } from "../model/AttendanceModel.js";
import { USER } from "../model/UserModel.js";



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

export const deleteEmployeeByAdmin = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await EMPLOYEE.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await ATTENDANCE.deleteMany({ employeeId: employee._id });
    await EMPLOYEE.findByIdAndDelete(employee._id);

    if (employee.user) {
      await USER.findByIdAndDelete(employee.user);
    }

    return res.status(200).json({
      message: "Employee deleted successfully",
      employeeId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone } = req.body;

    let employee = await EMPLOYEE.findOne({ user:userId }).populate("user");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    if (name) employee.name = name;
    if (phone) employee.phone = phone;

    const updatedEmployee = await employee.save();

    const populatedProfile = await EMPLOYEE.findById(updatedEmployee._id)
      .populate("user", "email role")
      .populate("department", "name");

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

export const getAttendanceHistory = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const selectedMonth = Number.isInteger(Number(month)) ? Number(month) : currentDate.getMonth() + 1;
    const selectedYear = Number.isInteger(Number(year)) ? Number(year) : currentDate.getFullYear();
    const start = new Date(selectedYear, selectedMonth - 1, 1);
    const end = new Date(selectedYear, selectedMonth, 1);
    const attendanceQuery = { date: { $gte: start, $lt: end } };

    if (req.user.role === "employee") {
      const employee = await getCurrentEmployee(req);
      if (!employee) {
        return res.status(404).json({ success: false, message: "Employee profile not found" });
      }
      attendanceQuery.employeeId = employee._id;
    }

    const records = await ATTENDANCE.find(attendanceQuery)
      .sort({ date: 1 })
      .populate({
        path: "employeeId",
        select: "name employeeID",
      });

    if (req.user.role === "employee") {
      const employee = await getCurrentEmployee(req);
      const recordsByDate = new Set(records.map((record) => {
        const date = new Date(record.date);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      }));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate() - 1);
      const lastDay = new Date(end);
      lastDay.setDate(lastDay.getDate() - 1);
      const effectiveLastDay = lastDay < today ? lastDay : today;

      for (let day = new Date(start); day <= effectiveLastDay; day.setDate(day.getDate() + 1)) {
        const dateKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
        if (day.getDay() !== 0 && day.getDay() !== 6 && !recordsByDate.has(dateKey)) {
          records.push({
            _id: `absent-${dateKey}`,
            date: new Date(day),
            status: "absent",
            checkIn: null,
            checkOut: null,
            employeeId: employee,
          });
        }
      }
      records.sort((first, second) => new Date(first.date) - new Date(second.date));
    }

    return res.status(200).json({
      month: selectedMonth,
      year: selectedYear,
      data: records.map((record) => ({
        id: record._id,
        date: record.date,
        status: record.status,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        employee: record.employeeId,
      })),
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

export const updateEmployeeByAdmin = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, phone, department, designation, status, salary } = req.body;
    const employee = await EMPLOYEE.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    if (name !== undefined) employee.name = name;
    if (phone !== undefined) employee.phone = phone;
    if (department !== undefined) employee.department = department;
    if (designation !== undefined) employee.designation = designation;
    if (status !== undefined) employee.status = status;
    if (salary !== undefined) employee.salary = Number(salary);

    const updatedEmployee = await employee.save();
    const populatedEmployee = await EMPLOYEE.findById(updatedEmployee._id)
      .populate("user", "email role")
      .populate("department", "name");

    return res.status(200).json({
      message: "Employee profile updated successfully",
      data: populatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await EMPLOYEE.findById(employeeId)
      .populate("user", "email role")
      .populate("department", "name");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const attendance = await ATTENDANCE.find({ employeeId: employee._id })
      .sort({ date: -1 })
      .select("date status checkIn checkOut");

    return res.status(200).json({
      data: {
        employee,
        attendance,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};