import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import themeReducer from "./slices/theme";

export default configureStore({
	reducer: {
		userAuth: authReducer,
		theme: themeReducer,
	},
});
