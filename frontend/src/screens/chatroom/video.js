import { Grid } from '@material-ui/core'
import React from 'react'

import Peer from 'simple-peer'
import { useSelector, useDispatch } from 'react-redux'

import { UA } from '../../actions/index'
import {
  MeCalling,
  UserHasCall,
  CallUser,
  VideoControls,
} from './videoComponents'

import { useStyles } from './styles'

export const Video = ({ socket, chatroomId }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { userDetails } = useSelector((state) => state.userDetails)
  const myVideo = React.useRef()
  const userVideo = React.useRef()
  const streamTrack = React.useRef()
  const connectionRef = React.useRef()

  const [userName, setUserName] = React.useState('')
  const [calling, setCalling] = React.useState(false)
  const [caller, setCaller] = React.useState('')
  const [callerSignal, setCallerSignal] = React.useState()

  const [callAnswerd, setCallAnswered] = React.useState(false)
  const [stream, setStream] = React.useState()

  React.useEffect(() => {
    dispatch(UA.getDetails())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (userDetails) {
      userDetails.privaterooms.map((room) =>
        room.users.map(
          (user) => user._id !== userDetails._id && setUserName(user.name)
        )
      )
    }
    return () => {}
  }, [userDetails])

  const getStreams = (streams) => {
    setStream(streams)
    myVideo.current.srcObject = streams
    streamTrack.current = streams
  }

  React.useEffect(() => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((streams) => getStreams(streams))
        .catch(console.log)
    }
    return () => {
      streamTrack.current.getTracks().forEach((track) => track.stop())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (socket) {
      socket.on('privateCalling', ({ chatroomId, signal, caller }) => {
        setCalling(true)
        setCaller(caller)
        setCallerSignal(signal)
      })
      socket.on('privateCallCancelled', ({ chatroomId, id }) => {
        setCalling(false)
      })
      socket.on('callEnded', () => {
        setCallAnswered(false)
        setCalling(false)
      })
    }
  }, [socket, userDetails])

  const callUser = async () => {
    if (socket) {
      const peer1 = new Peer({
        initiator: true,
        stream: stream,
        trickle: false,
      })
      peer1.on('signal', (signal) => {
        socket.emit('privateCall', {
          chatroomId,
          signal,
          caller: userDetails.name,
          callerId: userDetails._id,
        })
      })
      peer1.on('stream', (str) => {
        userVideo.current.srcObject = str
      })
      socket.on('privateCallAnswered', ({ signal }) => {
        setCallAnswered(true)
        peer1.signal(signal)
      })
      connectionRef.current = peer1
    }
  }

  const answerCall = () => {
    setCallAnswered(true)
    const peer2 = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    })
    peer2.on('signal', (data) => {
      socket.emit('privateCallAnswer', { chatroomId, signal: data })
    })
    peer2.on('stream', (stream) => {
      userVideo.current.srcObject = stream
    })
    peer2.signal(callerSignal)
    connectionRef.current = peer2
  }

  const cancelCall = () => {
    setCalling(false)
    if (socket) {
      socket.emit('privateCancelCall', { chatroomId, id: userDetails._id })
    }
  }

  const endCall = () => {
    setCalling(false)
    setCallAnswered(false)
    if (socket) {
      socket.emit('callEnd', { chatroomId })
    }
    // connectionRef.current.destroy()
  }

  return (
    <Grid container>
      {!callAnswerd ? (
        calling ? (
          caller === userDetails.name ? (
            <MeCalling cancelCall={cancelCall} userName={userName} />
          ) : (
            <UserHasCall answerCall={answerCall} caller={caller} />
          )
        ) : (
          <CallUser callUser={callUser} calling={calling} userName={userName} />
        )
      ) : (
        ''
      )}

      <div
        style={{ position: 'relative', width: '100%', height: '100%' }}
        className={callAnswerd ? classes.show : classes.hidden}
      >
        <div
          style={{
            width: '100%',
            minHeight: '100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '20%',
              height: '20%',
              right: 10,
              bottom: 10,
              padding: 5,
              zIndex: 10,
            }}
          >
            <video ref={myVideo} playsInline autoPlay muted width='100%' />
          </div>
          <video
            playsInline
            autoPlay
            muted={!callAnswerd}
            ref={userVideo}
            width='100%'
            height='100%'
          />
        </div>
        <div
          style={{
            position: 'absolute',
            margin: 'auto',
            bottom: 0,
            textAlign: 'center',
          }}
        >
          <VideoControls endCall={endCall} />
        </div>
      </div>
    </Grid>
  )
}
