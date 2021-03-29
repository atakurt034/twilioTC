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

export const userSearchReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.USER_SEARCH_REQUEST:
      return { loading: true }
    case USER.USER_SEARCH_SUCCESS:
      return { loading: false, user: action.payload }
    case USER.USER_SEARCH_FAIL:
      return { loading: false, error: action.payload }
    case USER.USER_SEARCH_RESET:
      return {}
    default:
      return state
  }
}

export const invteUserReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.INVITE_PUBLIC_REQUEST:
      return { loading: true }
    case USER.INVITE_PUBLIC_SUCCESS:
      return { loading: false, status: action.payload }
    case USER.INVITE_PUBLIC_FAIL:
      return { loading: false, error: action.payload }
    case USER.INVITE_PUBLIC_RESET:
      return {}
    default:
      return state
  }
}

export const deleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.DELETE_REQUEST:
      return { loading: true }
    case USER.DELETE_SUCCESS:
      return { loading: false, status: action.payload }
    case USER.DELETE_FAIL:
      return { loading: false, error: action.payload }
    case USER.DELETE_RESET:
      return {}
    default:
      return state
  }
}

export const updateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER.UPATE_PROFILE_REQUEST:
      return { loading: true }
    case USER.UPATE_PROFILE_SUCCESS:
      return { loading: false, status: action.payload }
    case USER.UPATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    case USER.UPATE_PROFILE_RESET:
      return {}
    default:
      return state
  }
}
