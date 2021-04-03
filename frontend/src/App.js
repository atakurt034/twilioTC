import React from 'react'

import { screen } from './screens/index'
import { Appbar } from './components/nav/appbar/appbar'
import { Footer } from './components/footer'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Device } from 'twilio-client'
import axios from 'axios'
import { Incoming } from './components/modalIncoming/incomingDrag'

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
  const [mute, setMute] = React.useState(false)
  const [answer, setAnswer] = React.useState(false)

  if (userLogin.userInfo) {
    userId = userLogin.userInfo._id
    name = userLogin.userInfo.name
  }

  const socket = io('https://foneapi.herokuapp.com/', {
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
        Twilio.on('disconnect', (d) => {
          Twilio.disconnectAll()
          console.log(d, 'disconnect')
          setAnswer(false)
          setOpen(false)
        })

        twilioRef.current = Twilio
      } catch (error) {
        console.log(error)
      }
    }
    getToken()
    return () => {
      setAnswer(false)
      setOpen(false)
    }
  }, [])

  const cancelHandler = () => {
    setOpen(false)
    twilioRef.current.disconnectAll()
  }

  const muteHandler = async () => {
    const conn = await twilioRef.current.activeConnection()
    conn.mute(!conn.isMuted())
    setMute(conn.isMuted())
    console.log(conn.isMuted())
  }

  const accept = (params) => {
    connectionRef.current.accept()
    setAnswer(true)
  }
  const reject = (params) => {
    connectionRef.current.reject()
    setAnswer(false)
    setOpen(false)
  }

  return (
    <BrowserRouter>
      <Incoming
        connectionRef={connectionRef}
        cancel={cancelHandler}
        open={open}
        setOpen={setOpen}
        twilioRef={twilioRef}
        mute={mute}
        muteHandler={muteHandler}
        accept={accept}
        reject={reject}
        answer={answer}
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
