    import express from "express"
    import userRouter from "./router/userRouter.js"
    import employeeRouter from "./router/employeeRouter.js"
    import { connectDB } from "./config/connectDB.js"
    import cors from "cors"

    const app = express()
    const PORT = process.env.PORT || 5000; 

    app.use(express.json())
    app.use(cors())
    connectDB()

    app.use("/api/user", userRouter )
    app.use("/api/employee", employeeRouter )

    app.get("/", (req, res) => {
  res.send("HRMS API Server is Running...");
});

app.listen(PORT , () =>{
        console.log("server running on Server: ", PORT)
})