import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: localStorage.getItem('chat-theme') || 'dark'
    },
    reducers:{
        setTheme(state, action){
            localStorage.setItem('chat-theme', action.payload);
            state.theme = action.payload
        }
    }
}) 

export const {setTheme} = themeSlice.actions;
export default themeSlice.reducer