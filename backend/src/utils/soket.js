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
const userSocketCount = new Map(); // userId -> number of sockets

function emitOnlineUsers() {
	const onlineUsers = Array.from(userSocketCount.keys());
	try {
		io.emit("onlineUsers", onlineUsers);
		console.log("Emitted onlineUsers:", onlineUsers);
	} catch (e) {
		console.error("Failed to emit onlineUsers", e);
	}
}

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	// If client passed auth with userId, join a room with that userId so we can target emits
	try {
		const userId = socket.handshake?.auth?.userId;
		if (userId) {
			socket.join(userId);
			console.log(`Socket ${socket.id} joined room ${userId}`);

			// increment socket count for this user
			const prev = userSocketCount.get(userId) || 0;
			userSocketCount.set(userId, prev + 1);
			// broadcast updated list
			emitOnlineUsers();
		}
	} catch (e) {
		console.error("Error during socket connection auth handling", e);
	}

	socket.on("disconnect", () => {
		console.log("A user disconnected", socket.id);
		try {
			const userId = socket.handshake?.auth?.userId;
			if (userId) {
				const prev = userSocketCount.get(userId) || 0;
				if (prev <= 1) {
					userSocketCount.delete(userId);
				} else {
					userSocketCount.set(userId, prev - 1);
				}
				emitOnlineUsers();
			}
		} catch (e) {
			console.error("Error during socket disconnect handling", e);
		}
	});
});

export { app, server, io };
