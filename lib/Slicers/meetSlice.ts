import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roomInfo: {}

};

export const meetSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom: (state, { payload }) => {
            state.roomInfo = payload
        },
        clearRoom: (state) => {
            state.roomInfo = {}
        }
    }
})

export const {
    setRoom,
    clearRoom
} = meetSlice.actions

export default meetSlice.reducer