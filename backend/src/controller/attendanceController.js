import { EMPLOYEE } from "../model/EmployeeModel.js";
import { ATTENDANCE } from "../model/AttendanceModel.js";
import { LEAVE } from "../model/LeaveModel.js";

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
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return "--";
  const totalMinutes = Math.max(
    0,
    Math.floor((new Date(checkOut) - new Date(checkIn)) / 60000),
  );
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
};

export const getTodayAttendance = async (req, res) => {
  try {
    const employee = await getCurrentEmployee(req);
    if (!employee)
      return res.status(404).json({ message: "Employee profile not found" });
    const { start, end } = getDayBounds();
    const attendance = await ATTENDANCE.findOne({
      employeeId: employee._id,
      date: { $gte: start, $lt: end },
    });
    return res.status(200).json({ data: attendance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyAttendanceStats = async (req, res) => {
  try {
    const employee = await getCurrentEmployee(req);
    if (!employee)
      return res.status(404).json({ message: "Employee profile not found" });
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const records = await ATTENDANCE.find({
      employeeId: employee._id,
      date: { $gte: monthStart, $lt: monthEnd },
    });
    let workingDays = 0;
    for (
      let day = new Date(monthStart);
      day <= now;
      day.setDate(day.getDate() + 1)
    ) {
      if (day.getDay() !== 0 && day.getDay() !== 6) workingDays += 1;
    }
    const presentDays = records.filter(
      (record) => record.status === "present" || record.checkIn,
    ).length;
    return res
      .status(200)
      .json({
        attendancePercentage: workingDays
          ? Math.min(100, Math.round((presentDays / workingDays) * 100))
          : 0,
        presentDays,
        workingDays,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAttendanceRecords = async (req, res) => {
  try {
    const { start, end } = getDayBounds();
    const attendanceQuery = { date: { $gte: start, $lt: end } };
    if (req.user.role === "employee") {
      const employee = await getCurrentEmployee(req);
      if (!employee)
        return res.status(404).json({ message: "Employee profile not found" });
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
      const isLate =
        checkIn &&
        (checkIn.getHours() > 9 ||
          (checkIn.getHours() === 9 && checkIn.getMinutes() > 30));
      const status =
        !checkIn && record.status === "absent"
          ? "On leave"
          : isLate
            ? "Late"
            : "Present";
      return {
        name: employee.name || "Unknown Employee",
        department:
          employee.department?.name || employee.department || "Unassigned",
        date: new Date(record.date).toLocaleDateString([], {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        checkIn: formatTime(checkIn),
        checkOut: formatTime(checkOut),
        hours: formatHours(checkIn, checkOut),
        status,
      };
    });
    return res.status(200).json({ data: attendanceList });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const currentDate = new Date();
    const selectedMonth = Number.isInteger(Number(req.query.month))
      ? Number(req.query.month)
      : currentDate.getMonth() + 1;
    const selectedYear = Number.isInteger(Number(req.query.year))
      ? Number(req.query.year)
      : currentDate.getFullYear();
    const start = new Date(selectedYear, selectedMonth - 1, 1);
    const end = new Date(selectedYear, selectedMonth, 1);
    const attendanceQuery = { date: { $gte: start, $lt: end } };
    let employee;
    if (req.user.role === "employee") {
      employee = await getCurrentEmployee(req);
      if (!employee)
        return res.status(404).json({ message: "Employee profile not found" });
      attendanceQuery.employeeId = employee._id;
    }
    const records = await ATTENDANCE.find(attendanceQuery)
      .sort({ date: 1 })
      .populate({ path: "employeeId", select: "name employeeID" });
    const leaveQuery = {
      status: "approved",
      startDate: { $lt: end },
      endDate: { $gte: start },
    };
    if (employee) leaveQuery.employeeId = employee._id;
    const approvedLeaves = await LEAVE.find(leaveQuery)
      .select("employeeId startDate endDate reason status")
      .populate("employeeId", "name employeeID");
    return res
      .status(200)
      .json({
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
        leaves: approvedLeaves,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const employee = await getCurrentEmployee(req);
    if (!employee)
      return res.status(404).json({ message: "Employee profile not found" });
    const { start, end } = getDayBounds();
    const existingAttendance = await ATTENDANCE.findOne({
      employeeId: employee._id,
      date: { $gte: start, $lt: end },
    });
    if (existingAttendance)
      return res
        .status(409)
        .json({
          message: "Attendance already marked for today",
          data: existingAttendance,
        });
    const attendance = await ATTENDANCE.create({
      employeeId: employee._id,
      status: "present",
      checkIn: new Date(),
    });
    return res
      .status(201)
      .json({ message: "Check-in marked successfully", data: attendance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const employee = await getCurrentEmployee(req);
    if (!employee)
      return res.status(404).json({ message: "Employee profile not found" });
    const { start, end } = getDayBounds();
    const attendance = await ATTENDANCE.findOne({
      employeeId: employee._id,
      date: { $gte: start, $lt: end },
    });
    if (!attendance)
      return res.status(400).json({ message: "Please mark check-in first" });
    if (attendance.checkOut)
      return res
        .status(409)
        .json({
          message: "Check-out already marked for today",
          data: attendance,
        });
    attendance.checkOut = new Date();
    await attendance.save();
    return res
      .status(200)
      .json({ message: "Check-out marked successfully", data: attendance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
