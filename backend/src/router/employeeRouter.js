import { Router } from "express";
import { authorizeAdmin, isAuth } from "../middelware/isAuth.js";
import {
	deleteEmployeeByAdmin,
	getAllEmployees,
	getEmployeeDetails,
	getMyProfile,
	updateEmployeeByAdmin,
	updateMyProfile,
} from "../controller/employeeController.js";
import {
	checkIn,
	checkOut,
	getAttendanceHistory,
	getAttendanceRecords,
	getMyAttendanceStats,
	getTodayAttendance,
} from "../controller/attendanceController.js";
import {
	applyLeave,
	getLeaveRequests,
	updateLeaveStatus,
} from "../controller/leaveController.js";

const router = Router()

router.route("/me").get(isAuth, getMyProfile)
router.route("/all").get(isAuth, getAllEmployees)
router.route("/:employeeId/details").get(isAuth, authorizeAdmin, getEmployeeDetails)
router.route("/:employeeId").delete(isAuth, authorizeAdmin, deleteEmployeeByAdmin)
router.route("/update-profile").put(isAuth, updateMyProfile)
router.route("/leave").post(isAuth, applyLeave).get(isAuth, getLeaveRequests)
router.route("/leave/:leaveId/status").patch(isAuth, authorizeAdmin, updateLeaveStatus)
router.route("/:employeeId/profile").put(isAuth, authorizeAdmin, updateEmployeeByAdmin)
router.route("/attendance").get(isAuth, getAttendanceRecords)
router.route("/attendance/history").get(isAuth, getAttendanceHistory)
router.route("/attendance/today").get(isAuth, getTodayAttendance)
router.route("/attendance/stats").get(isAuth, getMyAttendanceStats)
router.route("/attendance/check-in").post(isAuth, checkIn)
router.route("/attendance/check-out").patch(isAuth, checkOut)

export default router