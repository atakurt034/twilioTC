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
