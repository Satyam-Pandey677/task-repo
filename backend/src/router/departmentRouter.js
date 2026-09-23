import { Router } from "express";
import {
    createDepartment,
    deleteDepartment,
    getAllDepartments,
    readDepartment,
    updateDepartment,
} from "../controller/DepartmentController.js";
import { authorizeAdmin, isAuth } from "../middelware/isAuth.js";

const router = Router()

router.route('/').post(isAuth, authorizeAdmin, createDepartment)
                .get(isAuth, authorizeAdmin, getAllDepartments)
                
router.route("/:departmentId")
            .put(isAuth, authorizeAdmin, updateDepartment)
            .delete(isAuth, authorizeAdmin, deleteDepartment)
            .get(isAuth, readDepartment)


export default router