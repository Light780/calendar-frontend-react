export const events = [
  {
    id: 1,
    title: 'Evento 1',
    notes: 'Nota 1',
    start: new Date('2022-10-21 13:00:00'),
    end: new Date('2022-10-21 15:00:00')
  },
  {
    id: 2,
    title: 'Evento 2',
    notes: 'Nota 2',
    start: new Date('2022-10-22 13:00:00'),
    end: new Date('2022-10-22 15:00:00')
  },
  {
    id: 3,
    title: 'Evento 3',
    notes: 'Nota 3',
    start: new Date('2022-10-23 13:00:00'),
    end: new Date('2022-10-23 15:00:00')
  }
]

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null
}

export const calendarWithEventsState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: null
}

export const calendarWithActiveEventState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: { ...events[0] }
}
