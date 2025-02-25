import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    isAuthenticated: localStorage.getItem("user") ? true : false,
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        userLoggedOut: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
    },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
