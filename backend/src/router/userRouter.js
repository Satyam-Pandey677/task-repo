import { Router } from "express";
import { createUser, loginUser, updatePassword } from "../controller/userController.js";
import { authorizeAdmin, isAuth } from "../middelware/isAuth.js";

const router = Router()

router.route("/create-user").post(isAuth, authorizeAdmin,createUser)
router.route("/login").post(loginUser)
router.route("/update-password").post(isAuth, updatePassword)

export default router