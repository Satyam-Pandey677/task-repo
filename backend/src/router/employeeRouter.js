import { Router } from "express";
import {  } from "../controller/userController.js";
import { isAuth } from "../middelware/isAuth.js";
import {
	checkIn,
	checkOut,
	getAttendanceRecords,
	getMyProfile,
	getTodayAttendance,
	updateMyProfile,
} from "../controller/employeeController.js";

const router = Router()

router.route("/me").get(isAuth, getMyProfile)
router.route("/update-profile").put(isAuth, updateMyProfile)
router.route("/attendance").get(isAuth, getAttendanceRecords)
router.route("/attendance/today").get(isAuth, getTodayAttendance)
router.route("/attendance/check-in").post(isAuth, checkIn)
router.route("/attendance/check-out").patch(isAuth, checkOut)

export default router