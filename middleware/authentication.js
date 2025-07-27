const jwt = require('jsonwebtoken');
const UserModel = require('../model/auth/UserModel');
const bcrypt = require('bcrypt');


const authentication = async (req, res, next) => {
    console.log("=== Authentication Middleware ===");
    console.log("Cookies received:", req.cookies);
    console.log("All headers:", req.headers);
    
    const token = req.cookies?.token;
  
     if(!token) {
        console.log("❌ No token found in cookies");
        return res.status(401).json({ success: false, message: 'Authentication token is missing' });
     }else{
        console.log("✅ Authentication token found:", token);
     }
     
     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decoded successfully:", decoded);
        
         const userValid = await UserModel.findById(decoded.id);
         console.log("✅ User found:", userValid ? userValid.username : "Not found");
         
            if (!userValid) {
                console.log("❌ User not found in database");
                return res.status(401).json({ success: false, message: 'Invalid authentication token' });
            }
        req.user = userValid;
        console.log("✅ Authentication successful for user:", userValid.username);
        next();
     } catch (error) {
      console.log('❌ Authentication error:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error during authentication' });
    }
}


module.exports = authentication;