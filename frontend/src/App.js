import React from 'react'

import { screen } from './screens/index'
import { Appbar } from './components/nav/appbar/appbar'
import { Footer } from './components/footer'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Device } from 'twilio-client'
import axios from 'axios'
import { Incoming } from './components/modalIncoming/incoming'

import { UA } from './actions/index'

import { io } from 'socket.io-client'

export const App = () => {
  const connectionRef = React.useRef()
  const twilioRef = React.useRef()
  const dispatch = useDispatch()
  let userId
  let name
  const userLogin = useSelector((state) => state.userLogin)

  const [open, setOpen] = React.useState(false)

  if (userLogin.userInfo) {
    userId = userLogin.userInfo._id
    name = userLogin.userInfo.name
  }

  const socket = io('http://192.168.254.111:5000', {
    query: { userId, name },
  })

  React.useEffect(() => {
    socket.emit('login')
    socket.on('refreshUserDetails', () => {
      dispatch(UA.getDetails())
    })

    return () => {
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const getToken = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        const { data } = await axios.post('/api/twilio/token', config)
        const Twilio = new Device()
        Twilio.setup(data)
        Twilio.on('ready', () => {
          console.log('Connected')
        })
        Twilio.on('incoming', (con) => {
          connectionRef.current = con
          setOpen(true)
        })
        Twilio.on('disconnect', () => {
          Twilio.disconnectAll()
          setOpen(false)
        })

        twilioRef.current = Twilio
      } catch (error) {
        console.log(error)
      }
    }
    getToken()
  }, [])

  const cancelHandler = () => {
    setOpen(false)
    connectionRef.current.reject()
  }

  return (
    <BrowserRouter>
      <Incoming
        connectionRef={connectionRef}
        cancel={cancelHandler}
        open={open}
        setOpen={setOpen}
        twilioRef={twilioRef}
      />
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
      <Route path='/profile' component={screen.Profile} exact />
      <Route
        path='/sms/:id'
        render={(e) => <screen.Sms {...e} socket={socket} />}
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
