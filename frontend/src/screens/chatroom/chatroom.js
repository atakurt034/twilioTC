import React from 'react'
import Peer from 'simple-peer'

import { Container, Grid } from '@material-ui/core'

import { useSelector, useDispatch } from 'react-redux'
import { UA } from '../../actions/index'

import { GetPermission } from './classHelpers'

import { useStyles } from './styles'

import {
  PrivateVideoControls,
  MeCalling,
  UserHasCall,
  CallUser,
} from './videoComponents'

import { ModalLoader } from '../../components/modalloader'
import { makeToast } from '../../components/toast'

export const Chatroom = ({ match, socket, history, location }) => {
  const dispatch = useDispatch()
  const chatroomId = match.params.id
  const userName = location.search.split('=')[1]

  const classes = useStyles()

  const myMicFeed = React.useRef()
  const myVideoFeed = React.useRef()
  const myVideoRef = React.useRef()
  const userVideoRef = React.useRef()
  const connectionRef = React.useRef()
  const myStream = React.useRef()
  const userSignal = React.useRef()

  const { userDetails, loading } = useSelector((state) => state.userDetails)

  const [stream, setStream] = React.useState()

  const [callerSignal, setCallerSignal] = React.useState()

  const [callAnswered, setCallAnswered] = React.useState(false)
  const [calling, setCalling] = React.useState(false)
  const [caller, setCaller] = React.useState('')
  const [unShared, setUnshared] = React.useState(true)

  const permission = new GetPermission(
    myMicFeed,
    myVideoFeed,
    myVideoRef,
    setStream
  )
  React.useEffect(() => {
    dispatch(UA.getDetails())
    myStream.current = navigator.mediaDevices && permission.getStreams()
    return () => {
      permission.closeStreams()
      endCall()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (socket) {
      socket.on('privateCalling', ({ signal, chatroomId, caller }) => {
        setCalling(true)
        setCaller(caller)
        setCallerSignal(signal)
      })
      socket.on('privateCallCancelled', () => {
        setCalling(false)
      })
      socket.on('callEnded', () => {
        setCalling(false)
        setCallAnswered(false)
        permission.closeStreams()
        window.location.reload()
        if (connectionRef.current) {
          connectionRef.current.destroy()
        }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  const callUser = () => {
    const peer = new Peer({ initiator: true, trickle: false, stream })

    peer.on('signal', (signal) => {
      socket.emit('privateCall', {
        signal,
        chatroomId,
        caller: userDetails.name,
      })
    })
    peer.on('stream', (stream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream
      }
    })
    socket.on('privateCallAnswered', ({ signal }) => {
      userSignal.current = signal
      peer.signal(signal)
      setCallAnswered(true)
      setCalling(false)
    })

    connectionRef.current = peer
  }

  const answerCall = () => {
    const peer = new Peer({ initiator: false, trickle: false, stream })
    peer.on('signal', (signal) => {
      socket.emit('privateCallAnswer', { signal, chatroomId })
    })
    peer.on('stream', (stream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream
      }
      setTimeout(() => {
        setCallAnswered(true)
        setCalling(false)
      }, 2000)
    })
    peer.signal(callerSignal)
    connectionRef.current = peer
  }

  const cancelCall = () => {
    socket.emit('privateCancelCall', { chatroomId })
  }

  const endCall = () => {
    socket.emit('callEnd', { chatroomId })
  }

  const trackHandler = (track) => {
    track.current.enabled = !track.current.enabled
  }

  const { userInfo } = useSelector((state) => state.userLogin)

  React.useEffect(() => {
    dispatch(UA.getDetails())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (socket) {
      socket.emit('privateJoin', { chatroomId, user: userInfo })
      socket.on('privateJoined', ({ chatroomId, user }) => {
        if (userInfo._id !== user._id) {
          makeToast('notification', 'success', `${user.name} joined`)
        }
      })
    }
  }, [chatroomId, socket, userInfo, history])

  const shareScreen = (params) => {
    const currStream = connectionRef.current.streams[0]
    const current = currStream.getVideoTracks()[0]
    current.enabled = false
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then((stream) => {
      const track = stream.getTracks()[0]
      connectionRef.current.replaceTrack(current, track, currStream)
      setUnshared(false)
      track.onended = () => {
        current.enabled = true
        connectionRef.current.replaceTrack(track, current, currStream)
        setUnshared(true)
      }
    })
  }

  return loading ? (
    <ModalLoader />
  ) : (
    <Container style={{ marginTop: 10 }}>
      <Grid
        container
        spacing={2}
        alignItems='center'
        style={{ minHeight: '70vh' }}
      >
        <Grid
          item
          xs={12}
          style={{
            padding: 5,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {!callAnswered ? (
            calling ? (
              caller === userDetails.name ? (
                <MeCalling cancelCall={cancelCall} userName={userName} />
              ) : (
                <UserHasCall
                  answerCall={answerCall}
                  caller={caller}
                  stream={stream}
                />
              )
            ) : (
              <CallUser
                callUser={callUser}
                calling={calling}
                userName={userName}
                stream={stream}
              />
            )
          ) : (
            ''
          )}

          <div
            style={{ position: 'relative', width: '100%', height: '100%' }}
            className={callAnswered ? classes.show : classes.hidden}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '20%',
                  height: '20%',
                  zIndex: 10,
                  position: 'absolute',
                  right: 30,
                  bottom: 35,
                  border: '2px solid red',
                }}
              >
                <video
                  ref={myVideoRef}
                  playsInline
                  autoPlay
                  muted
                  width='100%'
                />
              </div>
              <div style={{ padding: 20 }}>
                <video
                  style={{ zIndex: 0 }}
                  playsInline
                  autoPlay
                  ref={userVideoRef}
                  width='100%'
                  height='100%'
                />
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <div
          style={{
            position: 'relative',
            margin: 'auto',
            bottom: 0,
            textAlign: 'center',
          }}
        >
          <PrivateVideoControls
            answered={callAnswered}
            chatroomId={chatroomId}
            socket={socket}
            userInfo={userInfo}
            setMute={() => trackHandler(myMicFeed)}
            setOffScreen={() => trackHandler(myVideoFeed)}
            endCall={endCall}
            shareScreen={shareScreen}
            unShared={unShared}
          />
        </div>
      </Grid>
    </Container>
  )
}
