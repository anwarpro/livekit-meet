import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    previousEvents: []
};

export const previousEventSlice = createSlice({
    name: 'previousEvents',
    initialState,
    reducers: {
        setPreviousEventStore: (state, { payload }) => {
            state.previousEvents = payload
        },

    }
})

export const {
    setPreviousEventStore,
} = previousEventSlice.actions

export default previousEventSlice.reducer