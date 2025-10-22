import { io } from "socket.io-client";

let socket = null;

const socketBaseUrl = import.meta.env.VITE_SOCKET_URL
	? import.meta.env.VITE_SOCKET_URL
	: import.meta.env.MODE === "development"
	? "http://localhost:5000"
	: window.location.origin;

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

	socket = io(url, {
		withCredentials: true,
		...opts,
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
