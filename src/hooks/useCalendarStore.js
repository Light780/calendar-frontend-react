import { useDispatch, useSelector } from 'react-redux'
import { addNewEvent, updateEvent, setActiveEvent, deleteEvent } from '../store'

export const useCalendarStore = () => {
  const dispatch = useDispatch()
  const { events, activeEvent } = useSelector(state => state.calendar)

  const onSetActiveEvent = (calendarEvent) => {
    dispatch(setActiveEvent(calendarEvent))
  }

  const startSavingEvent = async (calendarEvent) => {
    // TODO: Llegar al backend

    // Todo bien

    if (calendarEvent._id) {
      dispatch(updateEvent({ ...calendarEvent }))
    } else {
      dispatch(addNewEvent({ ...calendarEvent, _id: new Date().getTime() }))
    }
  }

  const startDeleteEvent = async () => {
    dispatch(deleteEvent())
  }

  return {
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    onSetActiveEvent,
    startSavingEvent,
    startDeleteEvent
  }
}
