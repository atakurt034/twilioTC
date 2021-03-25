import { CHAT } from '../constants/index'

export const privateCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.CREATE_PRIVATE_REQUEST:
      return { loading: true }
    case CHAT.CREATE_PRIVATE_SUCCESS:
      return { loading: false, chatroom: action.payload }
    case CHAT.CREATE_PRIVATE_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.CREATE_PRIVATE_RESET:
      return {}
    default:
      return state
  }
}

export const privateGetMessagesReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.PRIVATE_MESSAGE_REQUEST:
      return { loading: true }
    case CHAT.PRIVATE_MESSAGE_SUCCESS:
      return { loading: false, msg: action.payload }
    case CHAT.PRIVATE_MESSAGE_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.PRIVATE_MESSAGE_RESET:
      return {}
    default:
      return state
  }
}

export const publicCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.CREATE_PUBLIC_REQUEST:
      return { loading: true }
    case CHAT.CREATE_PUBLIC_SUCCESS:
      return { loading: false, chatroom: action.payload }
    case CHAT.CREATE_PUBLIC_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.CREATE_PUBLIC_RESET:
      return {}
    default:
      return state
  }
}

export const publicGetMessagesReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.PUBLIC_MESSAGE_REQUEST:
      return { loading: true }
    case CHAT.PUBLIC_MESSAGE_SUCCESS:
      return { loading: false, messages: action.payload }
    case CHAT.PUBLIC_MESSAGE_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.PUBLIC_MESSAGE_RESET:
      return {}
    default:
      return state
  }
}
