import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { connectSocketClient, disconnectSocket, getSocket } from "../lib/socket";
import { onlineUsersUpdated } from "../store/slices/auth";

const SocketContext = createContext(null);

export function SocketProvider({ children, url = "https://chat-app-production-095c.up.railway.app", auth }) {
	const [connected, setConnected] = useState(false);
	const socketRef = useRef(null);
	const dispatch = useDispatch();

	useEffect(() => {
		// if auth is provided (e.g., { userId }), connect
		if (!auth?.userId) return;

		const socket = connectSocketClient(url, { auth });
		socketRef.current = socket;

		const onConnect = () => setConnected(true);
		const onDisconnect = () => setConnected(false);

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		// optional: listen for online users event
		const onOnlineUsers = (users) => {
			console.debug("SocketProvider received onlineUsers", users);
			dispatch(onlineUsersUpdated(users));
		};
		socket.on("onlineUsers", onOnlineUsers);

		return () => {
			try {
				socket.off("connect", onConnect);
				socket.off("disconnect", onDisconnect);
				socket.off("onlineUsers", onOnlineUsers);
			} catch (e) {}
			disconnectSocket();
		};
	}, [auth, url]);

	const connect = (opts) => {
		const s = connectSocketClient(url, opts || { auth });
		socketRef.current = s;
		return s;
	};

	const disconnect = () => {
		disconnectSocket();
		socketRef.current = null;
	};

	const value = {
		socket: socketRef.current ?? getSocket(),
		connected,
		connect,
		disconnect,
	};

	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
	return useContext(SocketContext);
}

export default SocketProvider;
