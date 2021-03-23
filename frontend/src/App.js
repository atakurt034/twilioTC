import React from 'react'

import { screen } from './screens/index'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { io } from 'socket.io-client'

export const App = () => {
  let token
  const userLogin = useSelector((state) => state.userLogin)

  if (userLogin.userInfo) {
    token = userLogin.userInfo.token
  }

  const socket = io('http://192.168.254.111:5000', {
    query: { token: token },
  })
  socket.connect()

  React.useEffect(() => {
    return () => {
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <Header />
      <Route path='/login' component={screen.Login} />
      <Route path='/register' component={screen.Register} />
      <Route
        path='/chatroom/:id'
        render={(e) => <screen.Chatroom {...e} socket={socket} />}
        exact
      />
      <Route
        path='/'
        render={(e) => <screen.Home {...e} socket={socket} />}
        exact
      />
      <Footer />
    </BrowserRouter>
  )
}
