import axios from 'axios'

import { USER } from '../constants/index'

export const register = (user) => async (dispatch) => {
  try {
    dispatch({ type: USER.REGISTER_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    const { data } = await axios.post('/api/user/register', user, config)
    dispatch({ type: USER.REGISTER_SUCCESS, payload: 'success' })
    dispatch({ type: USER.LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER.REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const login = (body) => async (dispatch) => {
  try {
    dispatch({ type: USER.LOGIN_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    const { data } = await axios.post('/api/user/login', body, config)
    dispatch({ type: USER.LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER.LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const logout = () => async (dispatch) => {
  dispatch({ type: USER.LOGOUT })
  localStorage.removeItem('userInfo')
}

export const addContact = (email) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.ADD_CONTACT_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: { 'Content-Type': 'application/json' },
      authorization: `Bearer ${userInfo.token}`,
    }

    const { data } = await axios.put(`/api/user/${userInfo._id}`, email, config)
    dispatch({ type: USER.ADD_CONTACT_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.ADD_CONTACT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
