import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { FabDelete } from '../../../src/calendar/components/FabDelete'
import { useCalendarStore } from '../../../src/hooks/useCalendarStore'
import { store } from '../../../src/store'

jest.mock('../../../src/hooks/useCalendarStore')

describe('Pruebas en <FabDelte />', () => {
  const mockStartDeleteEvent = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  test('debe de mostrar el componente correctamente', () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: false
    })

    render(
      <Provider store={store}>
        <FabDelete />
      </Provider>
    )

    const btn = screen.getByRole('button', { hidden: true })
    expect(btn.classList).toContain('btn')
    expect(btn.classList).toContain('btn-danger')
    expect(btn.classList).toContain('fab-delete')
    expect(btn.style.display).toEqual('none')
  })

  test('debe de mostrar el boton si hay evento activo', () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true
    })

    render(
      <Provider store={store}>
        <FabDelete />
      </Provider>
    )

    const btn = screen.getByRole('button')
    expect(btn.classList).toContain('btn')
    expect(btn.classList).toContain('btn-danger')
    expect(btn.classList).toContain('fab-delete')
    expect(btn.style.display).not.toEqual('none')
  })

  test('debe de llamar el startDeletingEvent si hay evento activo', () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
      startDeleteEvent: mockStartDeleteEvent
    })

    render(
      <Provider store={store}>
        <FabDelete />
      </Provider>
    )

    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(mockStartDeleteEvent).toHaveBeenCalled()
  })
})
