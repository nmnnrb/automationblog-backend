const UserModel = require("../../model/auth/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { username, email, password , profileImage } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const existing = await UserModel.findOne({ email , username });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = new UserModel({
      username,
      email,
      password,
      profileImage: profileImage || "profile.jpg" 
    });
    console.log("s1")
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("s2") 
  console.log("token", token)
console.log("Cookie headers:", req.headers);
console.log("Frontend URL from env:", process.env.FORNTEND_URL);
const isHttps = process.env.FORNTEND_URL?.startsWith('https') || false;
console.log("Is HTTPS:", isHttps);
res.cookie("token", token, {
  httpOnly: true,
  secure: isHttps,  // Only secure for HTTPS
  sameSite: isHttps ? 'none' : 'lax',  // none for HTTPS, lax for HTTP
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  // path: "/",
})
.status(201)
.json({
  success: true,
  message: "User created successfully",
  user: {
    username: newUser.username,
    email: newUser.email,
    profileImage: newUser.profileImage || "profile.jpg"
  },
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
  const isHttps = process.env.FORNTEND_URL?.startsWith('https') || false;
  console.log("Login - Is HTTPS:", isHttps);
  res.cookie('token', token, {
  httpOnly: true,
  secure: isHttps,  // Only secure for HTTPS
  sameSite: isHttps ? 'none' : 'lax',  // none for HTTPS, lax for HTTP
  maxAge: 24 * 60 * 60 * 1000, // 1 day
}).status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          profileImage: user.profileImage || "profile.jpg" 
        },
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
