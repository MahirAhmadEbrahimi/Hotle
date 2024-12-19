import express from "express";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import user from "./routes/userRoute.js";
import hotel from "./routes/hotelRoute.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
