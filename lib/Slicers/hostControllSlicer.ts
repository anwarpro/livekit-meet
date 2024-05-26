import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    control: {
        microphone: true,
        camera: false,
        screenShare: true,
        chat: true,
        handRaise: true
    }
};

export const controlSlice = createSlice({
    name: 'control',
    initialState,
    reducers: {
        setControls: (state, { payload }) => {
            state.control = payload
        },

    }
})

export const {
    setControls,
} = controlSlice.actions

export default controlSlice.reducer