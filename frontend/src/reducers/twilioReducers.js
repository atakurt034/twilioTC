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
