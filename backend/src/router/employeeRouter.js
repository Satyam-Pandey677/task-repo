import { Router } from "express";
import {  } from "../controller/userController.js";
import { isAuth } from "../middelware/isAuth.js";
import { getMyProfile, updateMyProfile } from "../controller/employeeController.js";

const router = Router()

router.route("/me").get(isAuth, getMyProfile)
router.route("/update-profile").put(isAuth, updateMyProfile)

export default router