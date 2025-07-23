const UserModel = require("../../model/auth/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = new UserModel({
      username,
      email,
      password,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token).status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({
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
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // localStorage.setItem("token" , token);
    res
      .cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access (for security)
        secure: false, // Set to true in production with HTTPS
        sameSite: "Lax", // Controls cross-site behavior (Lax is usually safe)
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        path: "/", // Optional: cookie is valid across all paths
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "failed to Login",
        error: error.message,
      });
  }
};

exports.check = async (req, res) => {
  return res.status(200).json({ success: true, message: "Finally start" });
};
