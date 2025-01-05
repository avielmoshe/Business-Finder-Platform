import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import usersRoutes from "./routes/userRoute.js";
import businessRoutes from "./routes/BusinessRoute.js";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
dotenv.config();

const uri = process.env.DB_URI;
mongoose.connect(uri).then(() => {
  console.log("connected");
});

app.get("/api/status", (req, res) => {
  res.send({ status: "server is running" });
});

app.use("/api/user", usersRoutes);
app.use("/api/business", businessRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
