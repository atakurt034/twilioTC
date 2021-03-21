import React from 'react'

import { screen } from './screens/index'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { BrowserRouter, Route } from 'react-router-dom'

import { io } from 'socket.io-client'

export const App = () => {
  const socket = io('http://192.168.254.111:5000')
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
        path='/'
        render={(e) => <screen.Home {...e} socket={socket} />}
        exact
      />
      <Footer />
    </BrowserRouter>
  )
}
