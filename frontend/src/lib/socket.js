import { io } from "socket.io-client";

let socket = null;

export function connectSocketClient(url = "http://localhost:5000", opts = {}) {
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
