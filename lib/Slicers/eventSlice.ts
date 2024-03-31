import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events: []
};

export const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEventStore: (state, { payload }) => {
            state.events = payload
        },

    }
})

export const {
    setEventStore,
} = eventSlice.actions

export default eventSlice.reducer