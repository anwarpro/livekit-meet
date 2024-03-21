import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    userData: {}
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, { payload }) => {
            state.token = payload
        },
        setUserData: (state, { payload }) => {
            state.userData = payload
        },
        clearUserData: (state) => {
            state.userData = {}
            state.token = null
        }
    }
})

export const {
    setToken,
    setUserData,
    clearUserData
} = authSlice.actions

export default authSlice.reducer