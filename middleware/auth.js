const jwt = require("jsonwebtoken");
const User = require("../models/User.models")

//We create middleware function for auth.
const auth = async(req, res , next) => {
    try {
        //Get token from header
    
        const token = req.header("Authorize")?.replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({success: false, message:"Access Denied.No token provided"})
            
        }
        // Verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({
                success:false, message: "Token is valid but user not found"
            });
        }

        //Add user to reques obj 
        req.user =  user;
        next();
         
    } catch (error) {
        return res.status(401).json({
            success:false , message:"Invalid token"
        });
    }
}

     module.exports = auth;
