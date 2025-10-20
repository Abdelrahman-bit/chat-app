import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store/index.js";
import SocketProvider from "./context/SocketProvider";

function RootWrapper() {
	const authUser = useSelector((state) => state.userAuth?.authUser);
	const auth = authUser ? { userId: authUser._id } : null;
	return (
		<SocketProvider auth={auth}>
			<App />
		</SocketProvider>
	);
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<RootWrapper />
			</Provider>
		</BrowserRouter>
	</StrictMode>
);
