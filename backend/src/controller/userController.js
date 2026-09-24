import bcrypt from "bcrypt";
import { USER } from "../model/UserModel.js";
import { EMPLOYEE } from "../model/EmployeeModel.js";
import { generateEmployeeId } from "../utils/genarateEmployeeId.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    department,
    designation,
    joiningDate,
    salary,
    status,
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "All Fields are required",
    });
  }

  const existUser = await USER.findOne({ email });
  if (existUser) {
    return res.status(409).json({
      messsage: "User All ready exist",
    });
  }


  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const newUser = await USER.create({
    name,
    email,
    password: hashPass,
    role,
  });

  if (!newUser) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  const employeeID = await generateEmployeeId();

  const newEmployee = await EMPLOYEE.create({
    employeeID,
    name,
    email,
    phone,
    department,
    designation,
    joiningDate: joiningDate || Date.now(),
    salary,
    status: status || "Active",
    user: newUser.id,
  });

  return res.status(201).json({
    message: "New Employee created successfully",
    user: newEmployee,
  });
};

const generateToken = (userId) => {
  const token = jwt.sign(userId, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const existUser = await USER.findOne({ email });
  if (existUser) {
    const isPasswordMatched = await bcrypt.compare(
      password,
      existUser.password,
    );

    if (isPasswordMatched) {

      const employeeProfile = await EMPLOYEE.findOne({ user: existUser._id })

      const token = generateToken({
        userId: existUser._id,
        employeeID: employeeProfile ? employeeProfile._id : null,
        role: existUser.role
      });

      return res.status(200).json({
        message: "User login Successfully",
        user: existUser,
        token: token
      });
    }
    throw new Error("Please enter correct password")
  }

  throw new Error("Something went wrong")
};

export const updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Enter all required fields" });
    }

    let user;
    if (email) {
      user = await USER.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Old password is wrong" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

