const axios = require('axios');
const jwt = require('jsonwebtoken');
const UserModel = require('../../model/auth/UserModel');

exports.googleLogin = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ success: false, message: "Missing access token" });
  }

  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { email, name, picture } = response.data;

    let user = await UserModel.findOne({ email });
const dummyPassword = Math.random().toString(36).slice(-8);
    if (!user) {
      user = await UserModel.create({
        username: name,
        email: email,
        password: dummyPassword, // Not needed for Google login
        profileImage: picture,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
        path: "/",
      })
      .status(200)
      .json({
        success: true,
        message: "Google login successful",
        user: {
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
      });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};
