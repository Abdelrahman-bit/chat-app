import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../lib/axios";

// Async thunk for checking auth — keeps side effects out of reducers
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
	try {
		const res = await instance.get("/auth/check");
		return res.data;
	} catch (err) {
		// return a useful payload on error
		return rejectWithValue(err.response?.data || err.message);
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState: {
		authUser: null,
		isLoggedIn: false,
		isSignUp: false,
		isUpdatingProfile: false,
		isCheckingAuth: true,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(checkAuth.pending, (state) => {
				state.isCheckingAuth = true;
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.authUser = action.payload;
				state.isCheckingAuth = false;
				state.isLoggedIn = !!action.payload;
			})
			.addCase(checkAuth.rejected, (state) => {
				state.authUser = null;
				state.isCheckingAuth = false;
				state.isLoggedIn = false;
			});
	},
});

export default authSlice.reducer;
