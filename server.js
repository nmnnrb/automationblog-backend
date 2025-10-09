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
  res.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Automation Blog API</title>
      <style>
        :root {
          --bg: #0b1020;
          --card: #121633;
          --muted: #a1acba;
          --text: #eef0f7;
          --accent: #ff7ac6;   /* pink */
          --accent-2: #7dd3fc; /* sky */
          --border: #23284a;
        }
        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          background:
            radial-gradient(1200px 700px at -10% -20%, rgba(255,122,198,0.22), transparent 60%),
            radial-gradient(1000px 600px at 110% -10%, rgba(125,211,252,0.18), transparent 60%),
            var(--bg);
          color: var(--text);
          display: grid;
          place-items: center;
        }
        .container {
          width: min(720px, calc(100% - 32px));
          margin: 56px auto;
        }
        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 14px 44px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
        }
        .header {
          padding: 30px 30px 18px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .logo {
          width: 46px; height: 46px; border-radius: 12px;
          display: grid; place-items: center;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: white; font-weight: 800;
          letter-spacing: 0.5px;
          box-shadow: 0 10px 26px rgba(124,108,255,0.35);
          transition: transform .15s ease;
        }
        .logo:hover { transform: rotate(3deg) scale(1.03); }
  h1 { margin: 0; font-size: 1.5rem; letter-spacing: 0.3px; }
  .sub { color: var(--muted); font-size: 0.95rem; }
        .body { padding: 28px; display: grid; gap: 24px; }
  .intro { color: var(--muted); line-height: 1.6; font-size: 0.98rem; }
  .intro p { margin: 0 0 10px; }
  .grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        .tile {
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          border-radius: 14px;
          padding: 18px;
        }
        .k {
          font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
        }
  .v { font-size: 1rem; margin-top: 8px; }
        a.btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 18px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          color: var(--text);
          text-decoration: none; font-weight: 700; font-size: 1rem;
          transition: transform .12s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease;
          background: rgba(255,255,255,0.03);
        }
        a.btn:hover { transform: translateY(-1px); border-color: rgba(255,255,255,0.28); background: rgba(255,255,255,0.06); }
  .primary { background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: white; border-color: transparent; box-shadow: 0 10px 24px rgba(255,122,198,0.35); }
  .primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(125,211,252,0.45); }
      </style>
    </head>
    <body>
      <main class="container">
        <section class="card">
          <div class="header">
            <div class="logo">AB</div>
            <div>
              <h1>Automation Blog API</h1>
              <div class="sub">Backend is online. This instance uses a free server and may take a moment to wake up.</div>
            </div>
          </div>
          <div class="body">
            <div class="intro">
              <p>Thanks for your patience! Because we’re using a free-tier server, you might occasionally notice a brief warm-up period. We’ve set up this landing page to confirm the backend is healthy and properly linked to your frontend.</p>
              <p>Good news — both backend and frontend are running. You can open the website using the button below.</p>
            </div>
            <div class="grid">
              <div class="tile">
                <div class="k">Frontend URL</div>
                <div class="v"><a class="btn primary" href="${frontendUrl}" target="_blank" rel="noopener noreferrer">Open Frontend</a></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </body>
  </html>`);
});

// Auth routes (no authentication required) - import controller directly
const authController = require("./controllers/authController/auth");
app.post("/signup", authController.signUp);
app.post("/login", authController.login);
app.get("/logincheck", authController.check);
const googleAuthController = require("./controllers/authController/googleAuth");
app.post("/google-login", googleAuthController.googleLogin);
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

app.get("/verify-user", authentication , (req,res) => {
  return res.status(200).json({
    success: true,
    message: "User is authenticated"
  });
});
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
