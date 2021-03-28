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

import { GetPermission } from './classHelpers'
import { ModalLoader } from '../../components/modalloader'

export const Video = ({ socket, chatroomId }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const myMicFeed = React.useRef()
  const myVideoFeed = React.useRef()
  const myVideoRef = React.useRef()
  const userVideoRef = React.useRef()
  const connectionRef = React.useRef()

  const { userDetails, loading } = useSelector((state) => state.userDetails)

  const [stream, setStream] = React.useState()

  const [callerSignal, setCallerSignal] = React.useState()

  const [userName, setUserName] = React.useState()
  const [callAnswered, setCallAnswered] = React.useState(false)
  const [calling, setCalling] = React.useState(false)
  const [caller, setCaller] = React.useState('')

  const permission = new GetPermission(
    myMicFeed,
    myVideoFeed,
    myVideoRef,
    setStream
  )
  React.useEffect(() => {
    dispatch(UA.getDetails())
    navigator.mediaDevices && permission.getStreams()
    return () => {
      permission.closeStreams()
      endCall()
    }
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
  }, [userDetails])

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
      setCallAnswered(true)
      setCalling(false)
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

  return loading ? (
    <ModalLoader />
  ) : (
    <Grid container style={{ alignItems: 'center', height: '100%' }}>
      {!callAnswered ? (
        calling ? (
          caller === userDetails.name ? (
            <MeCalling cancelCall={cancelCall} userName={userName} />
          ) : (
            <UserHasCall answerCall={answerCall} caller={caller} />
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
              padding: 5,
              zIndex: 10,
              position: 'absolute',
              right: 0,
              bottom: 10,
            }}
          >
            <video ref={myVideoRef} playsInline autoPlay muted width='100%' />
          </div>
          <video
            style={{ zIndex: 0 }}
            playsInline
            autoPlay
            ref={userVideoRef}
            width='100%'
            height='100%'
          />
        </div>
        <div
          style={{
            position: 'relative',
            margin: 'auto',
            bottom: 0,
            textAlign: 'center',
          }}
        >
          <VideoControls
            style={{
              width: '50%',
              position: 'absolute',
              bottom: 10,
              left: '20%',
              backgroundColor: 'transparent',
            }}
            endCall={endCall}
            setMute={() => trackHandler(myMicFeed)}
            setOffScreen={() => trackHandler(myVideoFeed)}
          />
        </div>
      </div>
    </Grid>
  )
}
