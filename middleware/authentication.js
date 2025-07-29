const jwt = require('jsonwebtoken');
const UserModel = require('../model/auth/UserModel');
const bcrypt = require('bcrypt');


const authentication = async (req, res, next) => {
  console.log("=== Authentication Middleware ===");
  console.log("Cookies received:", req.cookies);
  console.log("All headers:", req.headers);

  const token = req.cookies?.token;

  if (!token) {
    console.log("❌ No token found in cookies");
    console.log("Accept header:", req.headers.accept);
    console.log("Checking if HTML request...");

    // For API calls, always return JSON (redirects don't work with fetch/axios)
    console.log("📤 Sending 401 JSON response");
    return res.status(401).json({
      success: false,
      message: 'Authentication token is missing',
      redirect: '/login'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", decoded);

    const userValid = await UserModel.findById(decoded.id);
    console.log("✅ User found:", userValid ? userValid.username : "Not found");

    if (!userValid) {
      console.log("❌ User not found in database");
      
      console.log("📤 Sending 401 JSON response for invalid user");
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
        redirect: '/login'
      });
    }

    req.user = userValid;
    console.log("✅ Authentication successful for user:", userValid.username);
    next();
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};


module.exports = authentication;