import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../lib/axios";
import toast from "react-hot-toast";

export const getUsers = createAsyncThunk("messages/getUsers", async (_, { rejectWithValue }) => {
	try {
		const res = await instance.get("/message/users");
		// backend returns { success: true, users }
		return res.data.users;
	} catch (error) {
		toast.error(`${error.response?.data.message}`);
		return rejectWithValue(error.response?.data);
	}
});

export const getMessages = createAsyncThunk("messages/getMessages", async (userId, { rejectWithValue }) => {
	try {
		const res = await instance.get(`/message/${userId}`);
		// backend returns { success: true, messages }
		return res.data.messages;
	} catch (error) {
		toast.error(`${error.response?.data.message}`);
		return rejectWithValue(error.response?.data);
	}
});

export const sendMessage = createAsyncThunk("messages/sendMessage", async (messageData, { rejectWithValue, getState }) => {
	try {
		// messageData can contain { text, image } - receiver id is taken from state
		const state = getState();
		// reducer key is `messages` in store
		const receiverId = state.messages.selectedUser?._id;
		if (!receiverId) return rejectWithValue({ message: "No selected user" });

		// messageData may include a tempId for optimistic reconciliation
		const { tempId, ...payload } = messageData;
		const res = await instance.post(`/message/users/${receiverId}`, payload);
		// backend returns { success: true, message }
		return { tempId, message: res.data.message };
	} catch (error) {
		toast.error(`${error.response?.data.message}`);
		return rejectWithValue(error.response?.data);
	}
});

const messageSlice = createSlice({
	name: "message",
	initialState: {
		messages: [],
		users: [],
		selectedUser: null,
		isUsersLoading: false,
		isMessagesLoading: false,
		isSendingMessage: false,
	},
	reducers: {
		setSelectedUser(state, action) {
			state.selectedUser = action.payload;
		},
		optimisticMessageAdded(state, action) {
			// action.payload should be the temp message object
			if (!state.messages) state.messages = [];
			state.messages.push(action.payload);
		},
		messageReceived(state, action) {
			// append incoming message to messages array
			if (!state.messages) state.messages = [];
			const incoming = action.payload;
			if (!state.messages.find((m) => m._id === incoming._id)) {
				state.messages.push(incoming);
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUsers.pending, (state) => {
				state.isUsersLoading = true;
			})
			.addCase(getUsers.fulfilled, (state, action) => {
				state.users = action.payload;
				state.isUsersLoading = false;
			})
			.addCase(getUsers.rejected, (state) => {
				state.isUsersLoading = false;
			})
			.addCase(getMessages.pending, (state) => {
				state.isMessagesLoading = true;
			})
			.addCase(getMessages.fulfilled, (state, action) => {
				state.messages = action.payload;
				state.isMessagesLoading = false;
			})
			.addCase(getMessages.rejected, (state) => {
				state.isMessagesLoading = false;
			})
			.addCase(sendMessage.pending, (state) => {
				state.isSendingMessage = true;
			})
			.addCase(sendMessage.fulfilled, (state, action) => {
				state.isSendingMessage = false;
				// action.payload: { tempId, message }
				const { tempId, message } = action.payload || {};
				if (message) {
					if (tempId) {
						// find temp message and replace
						const idx = state.messages.findIndex((m) => m.__tempId === tempId);
						if (idx !== -1) {
							state.messages[idx] = message;
							return;
						}
					}
					// fallback: push if not duplicate
					if (!state.messages.find((m) => m._id === message._id)) {
						state.messages.push(message);
					}
				}
			})
			.addCase(sendMessage.rejected, (state) => {
				state.isSendingMessage = false;
			});
	},
});

export const { setSelectedUser, optimisticMessageAdded, messageReceived } = messageSlice.actions;
export default messageSlice.reducer;
