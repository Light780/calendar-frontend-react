export const initialState = {
  status: 'not-authenticated',
  user: {},
  errorMessage: undefined
}

export const authenticatedState = {
  status: 'authenticated',
  user: {
    uid: 'ABC',
    name: 'Bruno Ramos'
  },
  errorMessage: undefined
}

export const notAuthenticatedState = {
  status: 'not-authenticated',
  user: {},
  errorMessage: undefined
}

export const checkingState = {
  status: 'checking',
  user: {},
  errorMessage: undefined
}
