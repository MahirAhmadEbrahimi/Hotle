import express from "express";
import dotenv from "dotenv/config";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
