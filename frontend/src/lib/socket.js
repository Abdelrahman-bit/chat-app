import { io } from "socket.io-client";

let socket = null;

const socketBaseUrl =
	import.meta.env.VITE_SOCKET_URL ||
	(import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://chat-app-production-095c.up.railway.app");

// debugging
console.log("VITE_SOCKET_URL:", import.meta.env.VITE_SOCKET_URL);
console.log("Mode:", import.meta.env.MODE);
console.log(socketBaseUrl);
export function connectSocketClient(url = socketBaseUrl, opts = {}) {
	if (socket) {
		if (!opts || !opts.auth) return socket;
		try {
			socket.disconnect();
		} catch {
			// ignore
		}
		socket = null;
	}

	// Ensure it always uses wss:// in production
	const finalUrl = import.meta.env.MODE === "production" ? url.replace(/^http/, "https") : url;

	socket = io(finalUrl, {
		withCredentials: true,
		transports: ["websocket", "polling"],
		secure: true, // force secure WebSocket in production
		...opts,
	});	
	console.log("Connecting to socket at:", finalUrl);


	// Debug logging
	socket.on("connect", () => {
		console.log("Socket connected:", socket.id);
		console.log("Connected to:", url);
	});

	socket.on("connect_error", (error) => {
		console.error("Socket connection error:", error.message);
		console.log("Attempted URL:", url);
	});

	socket.on("disconnect", (reason) => {
		console.log("Socket disconnected:", reason);
	});

	socket.on("onlineUsers", (users) => {
		console.log("Online users updated:", users);
	});

	return socket;
}

export function getSocket() {
	return socket;
}

export function disconnectSocket() {
	if (!socket) return;
	try {
		socket.disconnect();
	} catch {
		// ignore
	}
	socket = null;
}
