import { Router } from "express";
import { isAuth } from "../middelware/isAuth.js";
import {
	checkIn,
	checkOut,
	getAllEmployees,
	getAttendanceRecords,
	getMyAttendanceStats,
	getMyProfile,
	getTodayAttendance,
	updateMyProfile,
} from "../controller/employeeController.js";

const router = Router()

router.route("/me").get(isAuth, getMyProfile)
router.route("/all").get(isAuth, getAllEmployees)
router.route("/update-profile").put(isAuth, updateMyProfile)
router.route("/attendance").get(isAuth, getAttendanceRecords)
router.route("/attendance/today").get(isAuth, getTodayAttendance)
router.route("/attendance/stats").get(isAuth, getMyAttendanceStats)
router.route("/attendance/check-in").post(isAuth, checkIn)
router.route("/attendance/check-out").patch(isAuth, checkOut)

export default router