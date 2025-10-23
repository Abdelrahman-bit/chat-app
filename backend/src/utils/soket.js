import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin:
			process.env.NODE_ENV === "production"
				? process.env.FRONTEND_URL || "https://chat-app-production-095c.up.railway.app"
				: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// Track connected sockets per user
const userSocketCount = new Map();

function emitOnlineUsers() {
	const onlineUsers = Array.from(userSocketCount.keys());
	io.emit("onlineUsers", onlineUsers);
}

io.on("connection", (socket) => {
	console.log("✅ User connected:", socket.id);

	const userId = socket.handshake?.auth?.userId;
	if (userId) {
		socket.join(userId);
		userSocketCount.set(userId, (userSocketCount.get(userId) || 0) + 1);
		emitOnlineUsers();
	}

	socket.on("disconnect", () => {
		const userId = socket.handshake?.auth?.userId;
		if (userId) {
			const prev = userSocketCount.get(userId) || 0;
			if (prev <= 1) userSocketCount.delete(userId);
			else userSocketCount.set(userId, prev - 1);
			emitOnlineUsers();
		}
		console.log("❌ User disconnected:", socket.id);
	});
});

export { app, server, io };
