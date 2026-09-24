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
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEmployeeByAdmin = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await EMPLOYEE.findById(employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
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
    return res.status(500).json({ message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone } = req.body;

    let employee = await EMPLOYEE.findOne({ user: userId }).populate("user");

    if (!employee) {
      return res.status(404).json({
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
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const updateEmployeeByAdmin = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, phone, department, designation, status, salary } = req.body;
    const employee = await EMPLOYEE.findById(employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
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
    return res.status(500).json({ message: error.message });
  }
};

export const getEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await EMPLOYEE.findById(employeeId)
      .populate("user", "email role")
      .populate("department", "name");

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found" });
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
    return res.status(500).json({ message: error.message });
  }
};
