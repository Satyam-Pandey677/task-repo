import { EMPLOYEE } from "../model/EmployeeModel.js";



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