const UserModel = require("../../model/auth/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { username, email, password, profileImage } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const existing = await UserModel.findOne({ email, username });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = new UserModel({
      username,
      email,
      password,
      profileImage: profileImage || "profile.jpg",
    });
    console.log("s1");
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("s2");
    console.log("token", token);
    console.log("Cookie headers:", req.headers);
    console.log("Frontend URL from env:", process.env.FORNTEND_URL);
    const isHttps = process.env.FORNTEND_URL?.startsWith("https") || false;
    console.log("Is HTTPS:", isHttps);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Only secure for HTTPS
        sameSite: "none", // none for HTTPS, lax for HTTP
        maxAge: 60 * 60 * 1000, // 1 hour
        path: "/",
      })
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        user: {
          username: newUser.username,
          email: newUser.email,
          profileImage: newUser.profileImage || "profile.jpg",
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to create account",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Credential are invalid" });

  try {
    const user = await UserModel.findOne({ email });
    console.log("User found:", user);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Login token generated:", token);
    // localStorage.setItem("token" , token);
    const isHttps = process.env.FORNTEND_URL?.startsWith("https") || false;
    console.log("Login - Is HTTPS:", isHttps);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Only secure for HTTPS
        sameSite: "none", // none for HTTPS, lax for HTTP
        maxAge: 60 * 60 * 1000, // 1 hour
        path: "/",
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          profileImage: user.profileImage || "profile.jpg",
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to Login",
      error: error.message,
    });
  }
};

exports.check = async (req, res) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
        redirect: "/login",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
        redirect: "/login",
      });
    }

    // Find user in DB
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login.",
        redirect: "/login",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User authenticated",
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage || "profile.jpg",
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
