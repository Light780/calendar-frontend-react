import { useDispatch, useSelector } from 'react-redux'
import { calendarApi } from '../api'
import { checking, clearErrorMessage, login, logout } from '../store/auth/authSlice'
import { clearEvents } from '../store/calendar/calendarSlice'

export const useAuthStore = () => {
  const dispatch = useDispatch()
  const { status, user, errorMessage } = useSelector(state => state.auth)

  const startLogin = async ({ email, password }) => {
    dispatch(checking())
    try {
      const { data } = await calendarApi.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      dispatch(login({ name: data.name, uid: data.uid }))
    } catch (error) {
      dispatch(logout(error.response.data?.msg || ''))
      setTimeout(() => {
        dispatch(clearErrorMessage())
      }, 10)
    }
  }

  const startRegister = async ({ name, email, password }) => {
    dispatch(checking())
    try {
      const { data } = await calendarApi.post('/auth/new', { name, email, password })
      localStorage.setItem('token', data.token)
      dispatch(login({ name: data.name, uid: data.uid }))
    } catch (error) {
      dispatch(logout(error.response.data?.msg || ''))
      setTimeout(() => {
        dispatch(clearErrorMessage())
      }, 10)
    }
  }

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token')
    if (!token) return dispatch(logout())

    try {
      const { data } = await calendarApi.get('auth/renew')
      localStorage.setItem('token', data.token)
      dispatch(login({ name: data.name, uid: data.uid }))
    } catch (error) {
      localStorage.clear()
      dispatch(logout())
    }
  }

  const startLogout = () => {
    localStorage.clear()
    dispatch(clearEvents())
    dispatch(logout())
  }

  return {
    errorMessage,
    status,
    user,
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout
  }
}
