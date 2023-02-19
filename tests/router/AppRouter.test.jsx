import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '../../src/hooks/useAuthStore'
import { AppRouter } from '../../src/router/AppRouter'
import { store } from '../../src/store'

jest.mock('../../src/hooks/useAuthStore')
jest.mock('../../src/calendar', () => ({
  CalendarPage: () => <h1>CalendarPage</h1>
}))

describe('Pruebas en <AppRouter />', () => {
  const mockCheckAuthToken = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  test('debe de mostrar la pantalla de carga y llamar el checkAuthToken', async () => {
    useAuthStore.mockReturnValue({
      status: 'checking',
      checkAuthToken: mockCheckAuthToken
    })

    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    )

    await waitFor(() => expect(mockCheckAuthToken).toHaveBeenCalled())
    expect(screen.getByText('Cargando...')).toBeTruthy()
  })

  test('debe de mostrar el login en caso de no estar autenticado', () => {
    useAuthStore.mockReturnValue({
      status: 'not-authenticated',
      checkAuthToken: mockCheckAuthToken
    })

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    )
    expect(screen.getByText('Ingreso')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  test('debe de mostrar el calendario si estamos autenticados', () => {
    useAuthStore.mockReturnValue({
      status: 'authenticated',
      checkAuthToken: mockCheckAuthToken
    })

    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    )

    expect(screen.getByText('CalendarPage')).toBeTruthy()
  })
})
