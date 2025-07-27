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
    origin: process.env.FORNTEND_URL,
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
  res.send("Hello, World!");
});

// Auth routes (no authentication required) - import controller directly
const authController = require("./controllers/authController/auth");
app.post("/signup", authController.signUp);
app.post("/login", authController.login);
app.get("/logincheck", authController.check);

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
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is missing" });
    }

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Message is required and must be a string",
        });
    }

    const response = await axios.post(
      "https://router.huggingface.co/novita/v3/openai/chat/completions",
      {
        messages: [{ role: "user", content: message }],
        model: "deepseek/deepseek-v3-0324",
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response?.data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res
        .status(500)
        .json({ error: "No valid reply from Hugging Face" });
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

app.get("/is-admin" , authentication, (req, res) => {
  const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is missing" });
    }

  res.json({ success: true , isAdmin: req.user._id  });
});


// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
