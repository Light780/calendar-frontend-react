import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { calendarApi } from '../api'
import { convertEventsToDateEvents } from '../helpers'
import { addNewEvent, updateEvent, setActiveEvent, deleteEvent, setEvents } from '../store'

export const useCalendarStore = () => {
  const dispatch = useDispatch()
  const { events, activeEvent } = useSelector(state => state.calendar)
  const { user } = useSelector(state => state.auth)

  const onSetActiveEvent = (calendarEvent) => {
    dispatch(setActiveEvent(calendarEvent))
  }

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get('/event')
      const events = convertEventsToDateEvents(data.events)
      dispatch(setEvents(events))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        const { data } = await calendarApi.put(`/event/${calendarEvent.id}`, calendarEvent)
        dispatch(updateEvent({ ...calendarEvent, id: data.event.id, user }))
      } else {
        const { data } = await calendarApi.post('/event', calendarEvent)
        dispatch(addNewEvent({ ...calendarEvent, id: data.event.id, user }))
      }
    } catch (error) {
      Swal.fire('Error al guardar', error.response.data?.msg, 'error')
    }
  }

  const startDeleteEvent = async () => {
    try {
      const { data } = await calendarApi.delete(`/event/${activeEvent.id}`)
      if (data.ok) {
        dispatch(deleteEvent())
      }
    } catch (error) {
      Swal.fire('Error al eliminar', error.response.data?.msg, 'error')
    }
  }

  return {
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    onSetActiveEvent,
    startSavingEvent,
    startDeleteEvent,
    startLoadingEvents
  }
}
