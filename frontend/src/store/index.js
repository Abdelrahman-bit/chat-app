import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import themeReducer from "./slices/theme";
import messagesReducer from "./slices/message";

export default configureStore({
	reducer: {
		userAuth: authReducer,
		theme: themeReducer,
		messages: messagesReducer
	},
});
