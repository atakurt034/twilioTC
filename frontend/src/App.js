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
  const { userInfo } = useSelector((state) => state.userLogin)

  const [open, setOpen] = React.useState(false)
  const [mute, setMute] = React.useState(false)
  const [answer, setAnswer] = React.useState(false)
  const [incomingData, setIncomingData] = React.useState({})

  const socket = io('http://192.168.254.111:5000', {
    query: {
      userId: userInfo && userInfo._id,
      name: userInfo && userInfo.name,
    },
  })

  React.useEffect(() => {
    const listener = (event, ...args) => {
      console.log(event, args)
    }

    socket.onAny(listener)
    socket.emit('login')
    socket.on('refreshUserDetails', () => {
      dispatch(UA.getDetails())
    })

    const button = document.querySelectorAll('h2 h6')

    if (button) {
      button.forEach((btn) => (btn.style.backgroundColor = 'red'))
    }

    return () => {
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document])

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
          setIncomingData({
            from: con.parameters.From,
            to: userInfo.mobile && userInfo.mobile.mobile,
          })
          connectionRef.current = con
          setOpen(true)
          console.log(con)
        })
        Twilio.on('disconnect', (d) => {
          Twilio.disconnectAll()
          setAnswer(false)
          setOpen(false)
          socket.emit('missedCall', {
            from: d.parameters.From,
            to: userInfo && userInfo.mobile.mobile,
            type: 'disconnected',
          })
          console.log(d, ' disc')
        })
        Twilio.on('cancel', (d) => {
          Twilio.disconnectAll()
          setAnswer(false)
          setOpen(false)
          socket.emit('missedCall', {
            from: d.parameters.From,
            to: userInfo && userInfo.mobile.mobile,
            type: 'canceled',
          })
          console.log(d, ' cancel')
        })
        Twilio.on('error', (d) => {
          Twilio.disconnectAll()
          setAnswer(false)
          setOpen(false)
          socket.emit('missedCall', {
            from: d.parameters.From,
            to: userInfo && userInfo.mobile.mobile,
            type: 'error',
          })
          console.log(d, ' error')
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
      setIncomingData({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    socket.emit('missedCall', {
      from: incomingData.from,
      to: incomingData.to,
      type: 'accepted',
    })
  }
  const reject = (params) => {
    connectionRef.current.reject()
    setAnswer(false)
    setOpen(false)
    socket.emit('missedCall', {
      from: incomingData.from,
      to: incomingData.to,
      type: 'rejected',
    })
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
