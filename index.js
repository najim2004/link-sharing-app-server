const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const linkRoutes = require("./routes/linkRoutes");
const platformRoutes = require("./routes/platformRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174, https://devlinks24.vercel.app",
      "https://devlinks24.web.app",
      "https://devlinks24.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/platforms", platformRoutes);

app.get("/", (req, res) => {
  res.send(
    "<div style='display:flex; height:100%; width:100%; justify-content:center; align-items:center;'><h1 style='text-align:center;'>Welcome to the link sharing app server</h1></div>"
  );
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
