import { addNewEvent, calendarSlice, clearEvents, deleteEvent, setActiveEvent, setEvents, updateEvent } from '../../../src/store/calendar/calendarSlice'
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from '../../fixtures/calendarStates'

describe('Pruebas en calendarSlice', () => {
  test('debe de regresar el estado inicial', () => {
    const state = calendarSlice.getInitialState()
    expect(state).toEqual(initialState)
  })

  test('setActiveEvent debe de activar el evento', () => {
    const state = calendarSlice.reducer(calendarWithEventsState, setActiveEvent(events[0]))
    expect(state.activeEvent).toEqual(events[0])
  })

  test('addNewEvent debe de agregar el evento', () => {
    const event = {
      id: 4,
      title: 'Evento 4',
      notes: 'Nota 4',
      start: new Date('2022-10-24 13:00:00'),
      end: new Date('2022-10-24 15:00:00')
    }

    const state = calendarSlice.reducer(calendarWithEventsState, addNewEvent(event))
    expect(state.events).toContain(event)
  })

  test('updateEvent debe de actualizar el evento', () => {
    const event = {
      id: 1,
      title: 'Evento 1 actualizado',
      notes: 'Nota 1 actualizada',
      start: new Date('2022-10-24 13:00:00'),
      end: new Date('2022-10-24 15:00:00')
    }

    const state = calendarSlice.reducer(calendarWithEventsState, updateEvent(event))
    expect(state.events).toContain(event)
  })

  test('deleteEvent debe de eliminar el evento activo', () => {
    const state = calendarSlice.reducer(calendarWithActiveEventState, deleteEvent(events[0]))
    expect(state.activeEvent).toBeNull()
    expect(state.events).not.toContain(events[0])
  })

  test('setEvents debe de cargar los eventos', () => {
    const state = calendarSlice.reducer(initialState, setEvents([...events]))
    expect(state.isLoadingEvents).toBeFalsy()
    expect(state.events.length).toBeGreaterThan(0)
  })

  test('clearEvents debe de limpiar los eventos', () => {
    const state = calendarSlice.reducer(calendarWithEventsState, clearEvents())
    expect(state).toEqual(initialState)
  })
})
