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

export const logout = () => async (dispatch, getState) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } }

    const {
      userLogin: { userInfo },
    } = getState()

    if (userInfo) {
      const { data } = await axios.post('/api/user/logout', config)

      console.log(data)
    }

    localStorage.removeItem('userInfo')
    dispatch({ type: USER.LOGOUT })
    document.location.href = '/login'
  } catch (error) {
    console.log(error)
  }
}

export const addContact = (email) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.ADD_CONTACT_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put('/api/user/invite', email, config)
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

export const search = (email) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.SEARCH_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/user', email, config)
    dispatch({ type: USER.SEARCH_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.SEARCH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const accept = (invite) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.ACCEPT_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put('/api/user', invite, config)
    dispatch({ type: USER.ACCEPT_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.ACCEPT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.DETAILS_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/user/${userInfo._id}`, config)
    dispatch({ type: USER.DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const searchALL = (query) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.USER_SEARCH_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/user/invite', query, config)
    dispatch({ type: USER.USER_SEARCH_SUCCESS, payload: data })
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

export const sendInvite = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.INVITE_PUBLIC_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`/api/user/invites`, id, config)
    dispatch({ type: USER.INVITE_PUBLIC_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.INVITE_PUBLIC_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const deleteContactOrGroup = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.DELETE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
      data: id,
    }

    const { data } = await axios.delete(`/api/user/${userInfo._id}`, config)
    dispatch({ type: USER.DELETE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateProfile = (update) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.UPATE_PROFILE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `/api/user/${userInfo._id}`,
      update,
      config
    )
    dispatch({ type: USER.UPATE_PROFILE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.UPATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const searchMobile = (mobileNum) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.SEARCH_MOBILE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/user/mobile/${mobileNum}`, config)
    dispatch({ type: USER.SEARCH_MOBILE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.SEARCH_MOBILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getGGFBLogin = () => async (dispatch) => {
  try {
    dispatch({ type: USER.LOGIN_REQUEST })

    const { data } = await axios.get('/api/auth/currentuser')

    dispatch({ type: USER.LOGIN_SUCCESS, payload: data })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER.LOGIN_SUCCESS,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
