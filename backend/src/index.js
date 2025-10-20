import express from "express";
import env from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import errorHandler from "./middleware/errorHandler.js";
import { connectDB } from "./utils/db.js";
import asyncHandler from "./utils/catchAsync.js";
import { protectedRoute } from "./middleware/authHandler.js";

env.config();
const port = process.env.PORT || 5000;
const app = express();
// Increase payload size limits to allow large base64 image uploads from the frontend
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use("/api/auth", authRouter);
app.use("/api/message", asyncHandler(protectedRoute), messageRouter);

app.use(errorHandler);
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	connectDB();
});
