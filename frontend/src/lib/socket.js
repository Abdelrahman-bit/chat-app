import { io } from "socket.io-client";

let socket = null;

export function connectSocketClient(url = "http://localhost:5000", opts = {}) {
	if (socket) return socket;
	socket = io(url, opts);
	return socket;
}

export function getSocket() {
	return socket;
}

export function disconnectSocket() {
	if (!socket) return;
	try {
		socket.disconnect();
	} catch (e) {
		// ignore
	}
	socket = null;
}

// named exports provided above by function declarations
