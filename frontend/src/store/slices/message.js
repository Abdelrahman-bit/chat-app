import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../lib/axios";
import toast from "react-hot-toast";

export const getUsers = createAsyncThunk("messages/getUsers", async (_, { rejectWithValue })=>{
    try {
        const res = await instance.get('/message/users');
        return res.data
    } catch (error) {
        toast.error(`${error.response?.data.message}`);
		return rejectWithValue(error.response?.data);
    }
});

export const getMessages = createAsyncThunk('messages/getMessages', async (userId, {rejectWithValue})=>{
    try {
        const res = await instance.get(`/message/${userId}`);
        return res.data
    } catch (error) {
        toast.error(`${error.response?.data.message}`);
		return rejectWithValue(error.response?.data);
    }
});

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (messageData, { rejectWithValue, getState }) => {
        try {
            // messageData can contain { text, image } - receiver id is taken from state
            const state = getState();
            const receiverId = state.message.selectedUser?._id;
            if (!receiverId) return rejectWithValue({ message: 'No selected user' });

            const res = await instance.post(`/message/users/${receiverId}`, messageData);
            return res.data; // backend returns { success: true, message: newMessage }
        } catch (error) {
            toast.error(`${error.response?.data.message}`);
            return rejectWithValue(error.response?.data);
        }
    }
);

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
    },
    reducers:{
        setSelectedUser(state, action){
            state.selectedUser = action.payload
        }
    },
    extraReducers: (builder) =>{
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
			.addCase(getMessages.rejected, (state)=>{
                state.isMessagesLoading = false;
            })
            .addCase(sendMessage.pending, (state) => {
                state.isMessagesLoading = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                // backend returns { success: true, message }
                if (action.payload?.message) state.messages.push(action.payload.message);
            })
            .addCase(sendMessage.rejected, (state) => {
                state.isMessagesLoading = false;
            })
    }
});

export const {setSelectedUser} = messageSlice.actions
export default messageSlice.reducer