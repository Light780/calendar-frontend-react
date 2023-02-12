import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoadingEvents: true,
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
    setEvents: (state, { payload }) => {
      state.isLoadingEvents = false
      state.events = payload
    },
    addNewEvent: (state, { payload }) => {
      state.events.push(payload)
      state.activeEvent = null
    },
    updateEvent: (state, { payload }) => {
      state.events = state.events.map(event => {
        if (event.id === payload.id) {
          return payload
        }
        return event
      })
      state.activeEvent = null
    },
    deleteEvent: (state) => {
      state.events = state.events.filter(event => event.id !== state.activeEvent.id)
      state.activeEvent = null
    },
    clearEvents: (state) => {
      state.isLoadingEvents = true
      state.events = []
      state.activeEvent = null
    }
  }
})

export const {
  addNewEvent,
  deleteEvent,
  updateEvent,
  setActiveEvent,
  setEvents,
  clearEvents
} = calendarSlice.actions
