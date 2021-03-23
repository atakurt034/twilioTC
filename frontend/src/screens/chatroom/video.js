import {
  Button,
  IconButton,
  TextField,
  Grid,
  Typography,
} from '@material-ui/core'
import React from 'react'

import PhoneIcon from '@material-ui/icons/Phone'

import Peer from 'simple-peer'
import { useSelector, useDispatch } from 'react-redux'

import { UA } from '../../actions/index'

export const Video = ({ socket, chatroomId }) => {
  const dispatch = useDispatch()
  const { userDetails } = useSelector((state) => state.userDetails)
  const myVideo = React.useRef()
  const userVideo = React.useRef()

  const [userName, setUserName] = React.useState('')
  const [calling, setCalling] = React.useState(false)
  const [caller, setCaller] = React.useState('')
  const [callerSignal, setCallerSignal] = React.useState()

  const [callAnswerd, setCallAnswered] = React.useState(false)
  const [stream, setStream] = React.useState()

  React.useEffect(() => {
    dispatch(UA.getDetails())
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

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((streams) => {
        setStream(streams)
        myVideo.current.srcObject = streams
      })
      .catch(() => {})
  }, [])

  React.useEffect(() => {
    if (socket) {
      socket.on('privateCalling', ({ chatroomId, signal, caller }) => {
        setCalling(true)
        setCaller(caller)
        setCallerSignal(signal)
      })
    }
  }, [])

  const callUser = () => {
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
        })
      })
      peer1.on('stream', (stream) => {
        userVideo.current.srcObject = stream
      })
      socket.on('privateCallAnswered', ({ signal }) => {
        setCallAnswered(true)
        peer1.signal(signal)
      })
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
    // connectionRef.current = peer
  }

  return (
    <Grid container>
      {!callAnswerd ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1>MyVideo</h1>
          <video
            playsInline
            autoPlay
            muted={!callAnswerd}
            ref={myVideo}
            width='200px'
          />
          <IconButton
            style={{ border: '1px solid green', color: 'green' }}
            onClick={calling ? answerCall : callUser}
          >
            <PhoneIcon />
          </IconButton>
          <Typography style={{ textAlign: 'center', padding: 5 }} variant='h6'>
            {calling
              ? caller === userDetails.name
                ? `calling ${userName}`
                : `${caller} is calling...`
              : `Call ${userName}`}
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h1>MyVideo</h1>
            <video
              playsInline={callAnswerd}
              autoPlay={callAnswerd}
              muted={!callAnswerd}
              ref={myVideo}
              width='200px'
            />
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h1>UserVideo</h1>
            <video
              playsInline={callAnswerd}
              autoPlay={callAnswerd}
              muted={!callAnswerd}
              ref={userVideo}
              width='200px'
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}
