const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const predictionRoutes = require("./routes/predictionRoutes");

dotenv.config();

const app = express();
const configuredClientOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOriginPatterns = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^https:\/\/.*\.vercel\.app$/
];

const isAllowedOrigin = (origin) =>
  configuredClientOrigins.includes(origin) ||
  allowedOriginPatterns.some((pattern) => pattern.test(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server running" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Populens AI API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/predict", predictionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing. Add it to server/.env. Example: JWT_SECRET=your_jwt_secret"
      );
    }

    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
