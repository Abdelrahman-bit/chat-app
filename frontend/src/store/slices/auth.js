import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../lib/axios";
import toast from "react-hot-toast";

// Async thunk for checking auth (keeps side effects out of reducers)
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
	try {
		const res = await instance.get("/auth/check");
		return res.data;
	} catch (err) {
		return rejectWithValue(err.response?.data);
	}
});

// Async thunk for signing up a user
export const signUp = createAsyncThunk("auth/signUp", async (userData, { rejectWithValue }) => {
	try {
		const res = await instance.post("/auth/signup", userData);
		toast.success("Account created Successfully");
		return res.data;
	} catch (err) {
		toast.error(err.response?.data);
		return rejectWithValue(err.response?.data);
	}
});

// Async thunk for loging out a user
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
	try {
		const res = await instance.post("/auth/logout");
		toast.success("Loged Out successfully!");
	} catch (error) {
		toast.error(err.response?.data);
		return rejectWithValue(err.response?.data);
	}
});

// Async thunk for loging out a user
export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
	try {
		const res = await instance.post("/auth/login", userData);
		toast.success("loged in successfully!");
		return res.data.data;
	} catch (error) {
		toast.error(`${error.response?.data.message}`);
		return rejectWithValue(error.response?.data);
	}
});

// Async thunk for updating profile 
export const updateProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
	try {
		const res = await instance.post("/auth/update-profile", data);
		toast.success("image uploaded!");
		return res.data.data
	} catch (error) {
		toast.error(`${error.response?.data.message}`);
		return rejectWithValue(error.response?.data);
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
				state.isLoggedIn = false;
			})
			.addCase(checkAuth.rejected, (state) => {
				state.authUser = null;
				state.isCheckingAuth = false;
				state.isLoggedIn = false;
			})
			.addCase(signUp.pending, (state) => {
				// You may set a 'isSigningUp' flag here if you want to track loading
				state.isSignUp = true;
			})
			.addCase(signUp.fulfilled, (state, action) => {
				// On successful signup the API may return the created user or a token; adjust as needed
				state.authUser = action.payload;
				state.isSignUp = true;
				state.isLoggedIn = !!action.payload;
			})
			.addCase(signUp.rejected, (state) => {
				state.isSignUp = false;
			})
			.addCase(logout.fulfilled, (state, action) => {
				state.authUser = null;
			})
			.addCase(login.pending, (state) => {
				state.isLoggedIn = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoggedIn = false;
				state.authUser = action.payload;
			})
			.addCase(login.rejected, (state) => {
				state.isLoggedIn = false;
			})
			.addCase(updateProfile.pending, (state)=>{
				state.isUpdatingProfile = true;
			})
			.addCase(updateProfile.fulfilled, (state, action)=>{
				state.isUpdatingProfile = false;
				state.authUser = action.payload;
			})
			.addCase(updateProfile.rejected, (state)=>{
				state.isUpdatingProfile = false
			})
	},
});

export default authSlice.reducer;
