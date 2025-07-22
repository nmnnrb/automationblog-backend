const jwt = require('jsonwebtoken');
const UserModel = require('../model/auth/UserModel');
const bcrypt = require('bcrypt');


const authentication = async (req, res, next) => {
    const token = req.cookies?.token;
  
     if(!token) {
        return res.status(401).json({ success: false, message: 'Authentication token is missing' });
     }
     
     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const userValid = await UserModel.findById(decoded.id);
            if (!userValid) {
                return res.status(401).json({ success: false, message: 'Invalid authentication token' });
            }
        req.user = userValid;
        next();
     } catch (error) {
      console.error('Authentication error:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error during authentication' });
    }
}


module.exports = authentication;