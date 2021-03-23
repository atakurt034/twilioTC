import { USER } from '../constants/index'

export const registerReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.REGISTER_REQUEST:
      return { loading: true }
    case USER.REGISTER_SUCCESS:
      return { loading: false, status: action.payload }
    case USER.REGISTER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.LOGIN_REQUEST:
      return { loading: true }
    case USER.LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER.LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case USER.LOGOUT:
      return {}
    default:
      return state
  }
}

export const searchReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.SEARCH_REQUEST:
      return { loading: true }
    case USER.SEARCH_SUCCESS:
      return { loading: false, user: action.payload }
    case USER.SEARCH_FAIL:
      return { loading: false, error: action.payload }
    case USER.SEARCH_RESET:
      return {}
    default:
      return state
  }
}

export const acceptReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.ACCEPT_REQUEST:
      return { loading: true }
    case USER.ACCEPT_SUCCESS:
      return { loading: false, status: action.payload }
    case USER.ACCEPT_FAIL:
      return { loading: false, error: action.payload }
    case USER.ACCEPT_RESET:
      return {}
    default:
      return state
  }
}

export const addContactReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.ADD_CONTACT_REQUEST:
      return { loading: true }
    case USER.ADD_CONTACT_SUCCESS:
      return { loading: false, status: action.payload }
    case USER.ADD_CONTACT_FAIL:
      return { loading: false, error: action.payload }
    case USER.ADD_CONTACT_RESET:
      return {}
    default:
      return state
  }
}

export const detailsReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.DETAILS_REQUEST:
      return { loading: true }
    case USER.DETAILS_SUCCESS:
      return { loading: false, userDetails: action.payload }
    case USER.DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case USER.DETAILS_RESET:
      return {}
    default:
      return state
  }
}
