const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const blogRoutes = require("./routes/blogRoutes");
const trackerRoute = require("./routes/trackerRoute");
const skillsRoutes = require("./routes/skillsRoutes");
const { OpenAI } = require("openai");
const axios = require("axios");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

app.use("/", blogRoutes);
app.use("/", trackerRoute);
app.use("/" ,skillsRoutes )
// OpenAI ChatGPT API Integration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.post('/gpt', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      'https://router.huggingface.co/novita/v3/openai/chat/completions',
      {
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'deepseek/deepseek-v3-0324',
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ response: reply });

  } catch (error) {
    console.error('Error from Hugging Face:', error.response?.data || error.message);
    res.status(500).json({ error: 'Hugging Face API error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
