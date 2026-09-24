import { EMPLOYEE } from "../model/EmployeeModel.js";
import { LEAVE } from "../model/LeaveModel.js";

const getCurrentEmployee = (req) => EMPLOYEE.findOne({ user: req.user.userId });

export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const employee = await getCurrentEmployee(req);
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });
    if (!startDate || !endDate || !reason?.trim()) return res.status(400).json({ message: "Start date, end date and reason are required" });
    if (new Date(endDate) < new Date(startDate)) return res.status(400).json({ message: "End date cannot be before start date" });
    const leave = await LEAVE.create({ employeeId: employee._id, startDate, endDate, reason: reason.trim() });
    return res.status(201).json({ message: "Leave request submitted", data: leave });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLeaveRequests = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "employee") {
      const employee = await getCurrentEmployee(req);
      if (!employee) return res.status(404).json({ message: "Employee profile not found" });
      query = { employeeId: employee._id };
    }
    const leaves = await LEAVE.find(query).sort({ createdAt: -1 }).populate({ path: "employeeId", select: "name employeeID department", populate: { path: "department", select: "name" } });
    return res.status(200).json({ data: leaves });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid leave status" });
    const leave = await LEAVE.findByIdAndUpdate(req.params.leaveId, { status }, { new: true }).populate({ path: "employeeId", select: "name employeeID" });
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    return res.status(200).json({ message: `Leave request ${status}`, data: leave });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
