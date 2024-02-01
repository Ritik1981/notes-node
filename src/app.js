import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import noteRoute from "./routes/noteRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/notes", noteRoute);

export default app;
