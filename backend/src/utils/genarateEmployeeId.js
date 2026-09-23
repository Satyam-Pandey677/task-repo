import { EMPLOYEE } from "../model/EmployeeModel.js"

export const generateEmployeeId = async() => {
    const lastEmployee = await EMPLOYEE.findOne().sort({ createAt: -1 });

    if(!lastEmployee ){
        return "EMP001";
    }

    const lastNumber = parseInt(
        lastEmployee.employeeID.replace("EMP", "")
    )

    const nextNumber = lastNumber + 1;

    return `EMP${String(nextNumber).padStart(3, "0")}`;
}