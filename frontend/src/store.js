import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { user } from './reducers/index'

const middleware = [thunk]

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const reducers = combineReducers({
  userRegister: user.registerReducer,
  userLogin: user.loginReducer,
  userSearch: user.searchReducer,
  userAccept: user.acceptReducer,
  userDetails: user.detailsReducer,
  userAddContact: user.addContactReducer,
})

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
}

export const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)
