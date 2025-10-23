import { io } from "socket.io-client";

let socket = null;

// ✅ Automatically uses the correct URL for production or dev
const socketBaseUrl =
	import.meta.env.MODE === "production" ? "https://chat-app-production-095c.up.railway.app" : "http://localhost:5000";

console.log("🌍 Mode:", import.meta.env.MODE);
console.log("🔗 Socket URL:", socketBaseUrl);

export function connectSocketClient(auth) {
	if (socket) {
		socket.disconnect();
		socket = null;
	}

	socket = io(socketBaseUrl, {
		withCredentials: true,
		transports: ["websocket", "polling"],
		secure: import.meta.env.MODE === "production",
		auth, // { userId }
	});

	socket.on("connect", () => {
		console.log("✅ Socket connected:", socket.id);
	});

	socket.on("connect_error", (err) => {
		console.error("❌ Socket connection error:", err.message);
	});

	socket.on("disconnect", (reason) => {
		console.log("⚠️ Socket disconnected:", reason);
	});

	socket.on("onlineUsers", (users) => {
		console.log("👥 Online users:", users);
	});

	return socket;
}

export function getSocket() {
	return socket;
}

export function disconnectSocket() {
	if (socket) socket.disconnect();
	socket = null;
}
