import express from "express";
import dotenv from "dotenv/config";
import mongoose from "mongoose";

import user from "./routes/userRoute.js";

const app = express();
app.use(express.json());

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
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
