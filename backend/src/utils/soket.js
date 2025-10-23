import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin:
			process.env.NODE_ENV === "production" ? "https://chat-app-production-095c.up.railway.app" : "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// Track connected sockets per userId so we can compute which userIds are online
io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	// If client passed auth with userId, join a room with that userId so we can target emits
	try {
		const userId = socket.handshake?.auth?.userId;
		if (userId) {
			socket.join(userId);
			console.log(`Socket ${socket.id} joined room ${userId}`);
		}
	} catch (e) {}

	socket.on("disconnect", () => {
		console.log("A user disconnected", socket.id);
	});
});
export { app, server, io };
