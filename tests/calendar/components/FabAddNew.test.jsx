import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { FabAddNew } from '../../../src/calendar/components/FabAddNew'
import { useUiStore } from '../../../src/hooks/useUiStore'
import { useCalendarStore } from '../../../src/hooks/useCalendarStore'
import { store } from '../../../src/store'

jest.mock('../../../src/hooks/useCalendarStore')
jest.mock('../../../src/hooks/useUiStore')

describe('Pruebas en <FabAddNew />', () => {
  const mockOpenDateModal = jest.fn()
  const mockOnSetActiveEvent = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  test('debe de mostrar el componente por defecto', () => {
    useCalendarStore.mockReturnValue({
      onSetActiveEvent: mockOnSetActiveEvent
    })

    useUiStore.mockReturnValue({
      openDateModal: mockOpenDateModal
    })

    render(
      <Provider store={store}>
        <FabAddNew />
      </Provider>
    )

    const btn = screen.getByRole('button')
    expect(btn.classList).toContain('btn')
    expect(btn.classList).toContain('btn-primary')
    expect(btn.classList).toContain('fab')
  })

  test('debe de llamar al onSetActiveEvent y openDateModal cuando se hace click en el boton', () => {
    useCalendarStore.mockReturnValue({
      onSetActiveEvent: mockOnSetActiveEvent
    })

    useUiStore.mockReturnValue({
      openDateModal: mockOpenDateModal
    })

    render(
      <Provider store={store}>
        <FabAddNew />
      </Provider>
    )

    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(mockOnSetActiveEvent).toHaveBeenCalled()
    expect(mockOpenDateModal).toHaveBeenCalled()
  })
})
