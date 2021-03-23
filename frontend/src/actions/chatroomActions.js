import axios from 'axios'

import { CHAT } from '../constants/index'

export const createPrivateRoom = (name) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT.CREATE_PRIVATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/chatroom/private', name, config)
    dispatch({ type: CHAT.CREATE_PRIVATE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CHAT.CREATE_PRIVATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
