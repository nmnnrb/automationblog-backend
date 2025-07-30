const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const blogRoutes = require("./routes/blogRoutes");
const trackerRoute = require("./routes/trackerRoute");
const skillsRoutes = require("./routes/skillsRoutes");
const { OpenAI } = require("openai");
const axios = require("axios");
const cookieParser = require("cookie-parser");

const authentication = require("./middleware/authentication");
dotenv.config();
const app = express();
const frontendUrl = process.env.FORNTEND_URL || "http://localhost:3000";
console.log("Frontend URL:", frontendUrl);
app.use(cookieParser());
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send(`Hello, World! Login to access the API. Frontend: ${frontendUrl}`);
});

// Auth routes (no authentication required) - import controller directly
const authController = require("./controllers/authController/auth");
app.post("/signup", authController.signUp);
app.post("/login", authController.login);
app.get("/logincheck", authController.check);
// ...existing code...
// Logout route: clears cookies and instructs client to clear localStorage
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/",
    secure: true, // must match login cookie
    httpOnly: true, // optional here but good practice
    sameSite: "none", // must match login cookie
  });
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

app.get("/verify-user", authentication);
// Protected routes (authentication required)
app.use("/", authentication, blogRoutes);
app.use("/", authentication, trackerRoute);
app.use("/", authentication, skillsRoutes);

// OpenAI ChatGPT API Integration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/gpt", authentication, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be a string",
      });
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMENI_API_KEY,
        },
      }
    );

    // const reply = response;
    const reply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: "No valid reply from AI" });
    }

    res.json({ response: reply });
  } catch (error) {
    console.error(
      "Error from Hugging Face:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Hugging Face API error" });
  }
});

app.get("/is-admin", authentication, (req, res) => {
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is missing" });
  }

  res.json({ success: true, isAdmin: req.user._id });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
