import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    control: {
        microphone: false,
        camera: false,
        screenShare: false,
        chat: false,
        handRaise: false
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