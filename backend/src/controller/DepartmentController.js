import { DEPARTMENT } from "../model/DepartmentModel.js"

const createDepartment = async(req, res) => {
    const {name} = req.body
    
    if(!name) {
        throw new Error(500, "Name is required")
    }

    const existDepartment = await DEPARTMENT.findOne({name})

    if(existDepartment){
        throw new Error(500, "Department already exist")
    }

    const department = await DEPARTMENT.create({name})

    return res.status(201)
    .json({
        message: "Department Created Successfully",
        department,
})
}

const updateDepartment = async(req, res) => {
    const {name} = req.body
    const {departmentId}= req.params

    if(!departmentId) {
        throw new Error(404, "Department Not Found")
    }

    const exist = await DEPARTMENT.findOne({name})
    if(exist) {
        throw new Error(409, "Department name already exist")
    }

    const department = await DEPARTMENT.findByIdAndUpdate(departmentId,{name},{new:true})

    if(!department){
        throw new Error(500, "Something went wrong while updating Department")
    }

    return res.status(200)
    .json({
        message:"Department Updated Successfully",
        department,
    })
}

const deleteDepartment = async(req, res) => {
    const {departmentId} = req.params
    
    if(!departmentId){
        throw new Error(404, "Department Not Found")
    }

    const department = await DEPARTMENT.findByIdAndDelete(departmentId)

    return res.status(200)
    .json({
        message:"Department Deleted Successfully",
        department,
    })
}

const getAllDepartments = async(req, res) => {
    const departments = await DEPARTMENT.find()

    if(!departments || departments.length == 0){
        throw new Error(404, "No Department found")
    }

    return res.status(200)
    .json({
        message: "All Departments fetched",
        departments,
    })
}

const readDepartment =async(req, res) => {
    const {departmentId} = req.params


    const department = await DEPARTMENT.findOne({_id:departmentId})

    if(!department){
        throw new Error(404, "Department not found")
    }

    return res.status(200)
    .json({
        message: "Department fetched",
        department,
    })
}



export{
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartments,
    readDepartment
}