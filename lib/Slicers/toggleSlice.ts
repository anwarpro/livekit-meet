import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isParticipantModalOpen: false,
    isChatOpen: false,
    isHostControlOpen: false,
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
        },
        setIsHostControlOpen: (state, { payload }) => {
            state.isHostControlOpen = payload
        }

    }
})

export const {
    setEventStore,
    setIsChatOpen,
    setIsHostControlOpen
} = toggleSlice.actions

export default toggleSlice.reducer