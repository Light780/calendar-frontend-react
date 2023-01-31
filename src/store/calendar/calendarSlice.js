import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  events: [],
  activeEvent: null
}

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setActiveEvent: (state, { payload }) => {
      state.activeEvent = payload
    },
    addNewEvent: (state, { payload }) => {
      state.events.push(payload)
      state.activeEvent = null
    },
    updateEvent: (state, { payload }) => {
      state.events = state.events.map(event => {
        if (event._id === payload._id) {
          return payload
        }
        return event
      })
      state.activeEvent = null
    },
    deleteEvent: (state) => {
      state.events = state.events.filter(event => event._id !== state.activeEvent._id)
      state.activeEvent = null
    }
  }
})

export const {
  addNewEvent,
  deleteEvent,
  updateEvent,
  setActiveEvent
} = calendarSlice.actions
