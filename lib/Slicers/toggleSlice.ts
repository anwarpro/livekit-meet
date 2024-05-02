import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isParticipantModalOpen: false
};

export const toggleSlice = createSlice({
    name: 'participant',
    initialState,
    reducers: {
        setEventStore: (state, { payload }) => {
            state.isParticipantModalOpen = payload
        },

    }
})

export const {
    setEventStore,
} = toggleSlice.actions

export default toggleSlice.reducer