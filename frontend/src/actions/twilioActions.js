import { TWILIO } from '../constants/index'
import axios from 'axios'

export const sendTextMsg = (text) => async (dispatch, getState) => {
  try {
    dispatch({ type: TWILIO.SEND_TEXT_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/twilio', text, config)
    dispatch({ type: TWILIO.SEND_TEXT_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: TWILIO.SEND_TEXT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const setToRead = (roomId) => async (dispatch, getState) => {
  try {
    dispatch({ type: TWILIO.SET_TO_READ_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put('/api/twilio/sms', { id: roomId }, config)
    dispatch({ type: TWILIO.SET_TO_READ_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: TWILIO.SET_TO_READ_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
