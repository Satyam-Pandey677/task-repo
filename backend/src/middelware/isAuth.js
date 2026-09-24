import jwt from "jsonwebtoken";

export const  isAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // req.user mein logged in user ki ID mil gayi
      req.user = decoded; 
      // console.log(req.user.role)
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};


export const authorizeAdmin = (req, res,next) => {

  const allowedRoles = ["hr", "admin"]
  
    if(req.user && allowedRoles.includes(req.user.role)){
        next()
    }else{
        res.status(403).json({
            status: "fail",
            message: "Not authorized as an admin"
        });
    }
}