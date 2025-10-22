import { io } from "socket.io-client";

let socket = null;

const defaultSocketUrl =
	import.meta.env.MODE === "production"
		? import.meta.env.VITE_SOCKET_URL || window.location.origin // ✅ works when backend serves frontend
		: "http://localhost:5000";

export function connectSocketClient(url = defaultSocketUrl, opts = {}) {
	// If there's an existing socket but the caller provided auth/options,
	// we should recreate the socket so the handshake uses the new auth info.
	if (socket) {
		// If no auth provided for new connection, reuse existing socket
		if (!opts || !opts.auth) return socket;
		try {
			socket.disconnect();
		} catch (e) {
			// ignore
		}
		socket = null;
	}

	socket = io(url, {
		withCredentials: true, // ✅ important if you use cookies/sessions
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
	} catch (e) {
		// ignore
	}
	socket = null;
}

// named exports provided above by function declarations
