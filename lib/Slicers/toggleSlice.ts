import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isParticipantModalOpen: false,
    isChatOpen: false
};

export const toggleSlice = createSlice({
    name: 'participant',
    initialState,
    reducers: {
        setEventStore: (state, { payload }) => {
            state.isParticipantModalOpen = payload
        },
        setIsChatOpen: (state, { payload }) => {
            state.isChatOpen = payload
        }

    }
})

export const {
    setEventStore,
    setIsChatOpen
} = toggleSlice.actions

export default toggleSlice.reducer