import { Router } from "express";
import { createUser, loginUser, updatePassword } from "../controller/userController.js";
import { isAuth } from "../middelware/isAuth.js";

const router = Router()

router.route("/create-user").post(createUser)
router.route("/login").post(loginUser)
router.route("/update-password").post(isAuth, updatePassword)

export default router