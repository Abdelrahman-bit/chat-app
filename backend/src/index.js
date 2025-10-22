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
import { app, server } from "./utils/soket.js";
import path from "path";
import { fileURLToPath } from "url";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

env.config();
const port = process.env.PORT || 5000;

// Increase payload size limits to allow large base64 image uploads from the frontend
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: "https://chat-app-production-095c.up.railway.app",
		credentials: true,
	})
);

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/message", asyncHandler(protectedRoute), messageRouter);

// Production: Serve frontend static files
if (process.env.NODE_ENV === "production") {
	// Serve static files from frontend build
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));
	const indexPath = path.join(__dirname, "../../frontend/dist/index.html");
	console.log("Serving index.html from:", indexPath);

	// Catch-all route for SPA - serves index.html for non-API routes
	// This replaces the problematic app.get("/(.*)", ...)
	app.use((req, res, next) => {
		// Only serve index.html for non-API routes
		if (!req.path.startsWith("/api")) {
			res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
		} else {
			next();
		}
	});
}

// Error handler - must be last
app.use(errorHandler);

// Start server
server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
	connectDB();
});
