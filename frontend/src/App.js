import React from 'react'

import { screen } from './screens/index'
import { Appbar } from './components/nav/appbar/appbar'
import { Footer } from './components/footer'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { io } from 'socket.io-client'

export const App = () => {
  let userId
  let name
  const userLogin = useSelector((state) => state.userLogin)

  if (userLogin.userInfo) {
    userId = userLogin.userInfo._id
    name = userLogin.userInfo.name
  }

  const socket = io('http://192.168.254.111:5000', {
    query: { userId, name },
  })
  // socket.connect()

  React.useEffect(() => {
    const listener = (event, ...args) => {
      console.log(event, args)
    }

    socket.onAny(listener)

    return () => {
      socket.disconnect()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <div>
        <Appbar />
      </div>
      <Route
        path='/chatroom/:id'
        render={(e) => <screen.Chatroom {...e} socket={socket} />}
      />
      <Route
        path='/public/:id'
        render={(e) => <screen.PublicChatroom {...e} socket={socket} exact />}
      />

      <Route path='/login' component={screen.Login} exact />
      <Route path='/register' component={screen.Register} exact />

      <Route
        path='/'
        render={(e) => <screen.Home {...e} socket={socket} />}
        exact
      />
      <Footer />
    </BrowserRouter>
  )
}
