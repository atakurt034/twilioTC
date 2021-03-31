import { TWILIO } from '../constants/index'

export const sendTextReducer = (state = {}, action) => {
  switch (action.type) {
    case TWILIO.SEND_TEXT_REQUEST:
      return { loading: true }
    case TWILIO.SEND_TEXT_SUCCESS:
      return { loading: false, info: action.payload }
    case TWILIO.SEND_TEXT_FAIL:
      return { loading: false, error: action.payload }
    case TWILIO.SEND_TEXT_RESET:
      return {}
    default:
      return state
  }
}

export const setToReadReducer = (state = {}, action) => {
  switch (action.type) {
    case TWILIO.SET_TO_READ_REQUEST:
      return { loading: true }
    case TWILIO.SET_TO_READ_SUCCESS:
      return { loading: false, info: action.payload }
    case TWILIO.SET_TO_READ_FAIL:
      return { loading: false, error: action.payload }
    case TWILIO.SET_TO_READ_RESET:
      return {}
    default:
      return state
  }
}
