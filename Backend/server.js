import express from "express";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import user from "./routes/userRoute.js";
import hotel from "./routes/hotelRoute.js";
import booking from "./routes/bookingRoute.js";
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the CORS middleware with options
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"], // Allow both origins
    credentials: true,
  })
);
// Connect to MongoDB
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully✨✨✨");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/api/v1/users", user);
app.use("/api/v1/hotels", hotel);
app.use("/api/v1/booking", booking);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
