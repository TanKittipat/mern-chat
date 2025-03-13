import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRouter from "./routers/auth.router.js";
import messageRouter from "./routers/message.router.js";
import { app, server } from "./lib/socket.js";

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>Hello, Chat API!!!</h1>");
});

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

server.listen(PORT, () => {
  console.log("Server is running on : http://localhost:" + PORT);
  connectDB();
});
