const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const blogRoutes = require("./routes/blogRoutes")
const trackerRoute = require("./routes/trackerRoute")
const app = express();
dotenv.config();
const port = process.env.PORT
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {

  res.send('Hello, World!');

});


app.use("/" , blogRoutes )
app.use("/" , trackerRoute)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}
);
