import { authSlice, login, logout, checking, clearErrorMessage } from '../../../src/store/auth/authSlice'
import { authenticatedState, checkingState, initialState, notAuthenticatedState } from '../../fixtures/authStates'
import { testUserCredential } from '../../fixtures/testUserCredential'

describe('Pruebas en authSlice', () => {
  test('debe de regresar el estado por defecto', () => {
    expect(authSlice.getInitialState()).toEqual(initialState)
  })

  test('debe de realizar el login', () => {
    const state = authSlice.reducer(initialState, login(testUserCredential))
    expect(state).toEqual({
      status: 'authenticated',
      user: testUserCredential,
      errorMessage: undefined
    })
  })

  test('debe de realizar el logout', () => {
    const state = authSlice.reducer(authenticatedState, logout())
    expect(state).toEqual(notAuthenticatedState)
  })

  test('debe de realizar el logout con mensaje de error', () => {
    const errorMessage = 'Credenciales incorrectas'
    const state = authSlice.reducer(authenticatedState, logout(errorMessage))
    expect(state).toEqual({
      ...notAuthenticatedState,
      errorMessage
    })
  })

  test('debe de realizar el checking', () => {
    const state = authSlice.reducer(initialState, checking())
    expect(state).toEqual(checkingState)
  })

  test('debe de limpiar el errorMessage', () => {
    const errorMessage = 'Credenciales incorrectas'
    let state = authSlice.reducer(authenticatedState, logout(errorMessage))
    state = authSlice.reducer(state, clearErrorMessage())
    expect(state.errorMessage).toBe(undefined)
  })
})
