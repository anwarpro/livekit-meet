import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    handRaised: []
};

export const handRaisedSlicer = createSlice({
    name: 'handRaise',
    initialState,
    reducers: {
        setHandRaised: (state, { payload }) => {
            state.handRaised = payload
        },

    }
})

export const {
    setHandRaised,
} = handRaisedSlicer.actions

export default handRaisedSlicer.reducer