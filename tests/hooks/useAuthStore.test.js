import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { calendarApi } from '../../src/api'
import { useAuthStore } from '../../src/hooks/useAuthStore'
import { authSlice } from '../../src/store/auth/authSlice'
import { authenticatedState, initialState, notAuthenticatedState } from '../fixtures/authStates'
import { testUserCredential } from '../fixtures/testUserCredential'

const getMockStore = (initialValue) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      auth: { ...initialValue }
    }
  })
}

const mockClearEvents = jest.fn()
jest.mock('../../src/store/calendar/calendarSlice', () => ({
  ...jest.requireActual('../../src/store/calendar/calendarSlice'),
  clearEvents: () => mockClearEvents
}))

describe('Pruebas en useAuthStore', () => {
  beforeEach(() => localStorage.clear())

  test('debe de retornar el estado por defecto', () => {
    const mockStore = getMockStore(initialState)

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
    })

    expect(result.current).toEqual({
      ...initialState,
      startLogin: expect.any(Function),
      startRegister: expect.any(Function),
      checkAuthToken: expect.any(Function),
      startLogout: expect.any(Function)
    })
  })

  test('startLogin debe de realizar el login correctamente', async () => {
    const mockStore = getMockStore(notAuthenticatedState)
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
    })

    const { startLogin } = result.current

    await act(async () => {
      await startLogin(testUserCredential)
    })

    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: {
        uid: '63e7d36b1aa347386890d6fe',
        name: 'bramos'
      }
    })
    expect(localStorage.getItem('token')).toEqual(expect.any(String))
  })

  test('startLogin debe de fallar la autenticación', async () => {
    const mockStore = getMockStore(notAuthenticatedState)
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
    })

    const { startLogin } = result.current

    await act(async () => {
      await startLogin({
        email: testUserCredential.email,
        password: 'aaaa'
      })
    })

    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: 'Bad credentials',
      status: 'not-authenticated',
      user: {}
    })
    expect(localStorage.getItem('token')).toBeNull()

    await waitFor(() => {
      expect(result.current.errorMessage).toBeUndefined()
    })
  })

  test('startRegister debe de realizar la creacion del usuario', async () => {
    const mockStore = getMockStore(notAuthenticatedState)
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
    })

    const { startRegister } = result.current

    const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
      data: {
        ok: true,
        uid: '111',
        name: 'test-user',
        token: 'abc'
      }
    })

    await act(async () => {
      await startRegister({ email: 'test@google.com', password: '123456789', name: 'test-user' })
    })

    expect(localStorage.getItem('token')).toEqual(expect.any(String))
    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: {
        name: 'test-user',
        uid: expect.any(String)
      }
    })
    spy.mockRestore()
  })

  test('startRegister debe de fallar la creacion del usuario', async () => {
    const mockStore = getMockStore(notAuthenticatedState)
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
    })

    const { startRegister } = result.current

    await act(async () => {
      await startRegister({ email: 'brunorlm88@gmail.com', password: '123456789', name: 'bramos' })
    })

    expect(localStorage.getItem('token')).toBeNull()
    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: 'User with that email already exists',
      status: 'not-authenticated',
      user: {}
    })

    await waitFor(() => {
      expect(result.current.errorMessage).toBeUndefined()
    })
  })

  test('checkAuthToken debe de fallar si no hay token', async () => {
    const mockStore = getMockStore(initialState)
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
    })

    const { checkAuthToken } = result.current

    await act(async () => {
      await checkAuthToken()
    })

    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({ ...notAuthenticatedState })
  })

  test('checkAuthToken debe de autenticar el usuario si hay token', async () => {
    const { data } = await calendarApi.post('/auth/login', { email: testUserCredential.email, password: testUserCredential.password })
    localStorage.setItem('token', data.token)

    const mockStore = getMockStore(initialState)
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
    })

    const { checkAuthToken } = result.current

    await act(async () => {
      await checkAuthToken()
    })

    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({
      ...authenticatedState,
      user: {
        name: data.name,
        uid: data.uid
      }
    })
  })

  test('startLogout debe de eliminar la sesion del usuario', () => {
    const mockStore = getMockStore(initialState)
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
    })

    const { startLogout } = result.current
    act(() => startLogout())

    expect(localStorage.getItem('token')).toBeNull()
    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({
      ...notAuthenticatedState
    })
    expect(mockClearEvents).toHaveBeenCalled()
  })
})
