import React from 'react'
import Peer from 'simple-peer'

import { Container, Grid, Paper } from '@material-ui/core'
import { PublicVideoControls } from './videoComponents'

import { useSelector } from 'react-redux'

import { AddUsers } from '../../components/floatingMenu'

const Video = (props) => {
  const ref = React.useRef()

  React.useEffect(() => {
    props.peer.on('stream', (stream) => {
      ref.current.srcObject = stream
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <video playsInline autoPlay ref={ref} width='100%' height='100%' />
}

export const PublicChatroom = ({ match, location, socket, history }) => {
  const userVideo = React.useRef()
  const peersRef = React.useRef([])
  const streamTrack = React.useRef()
  const streamRef = React.useRef()
  const myMicFeed = React.useRef()
  const myVideoFeed = React.useRef()

  const [peers, setPeers] = React.useState([])

  const { userInfo } = useSelector((state) => state.userLogin)

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
  }, [userInfo, history])

  // eslint-disable-next-line no-unused-vars

  const roomID = match.params.id
  const roomName = location.search
    .split('=')[1]
    .replace(/%20/g, ' ')
    .toUpperCase()

  React.useEffect(() => {
    navigator.mediaDevices &&
      userInfo &&
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userVideo.current.srcObject = stream
          streamRef.current = stream
          socket.emit('join room', {
            roomID,
            name: userInfo.name,
          })

          socket.on('all users', ({ id }) => {
            const peers = []
            id.forEach((userID) => {
              const peer = createPeer(userID, socket.id, stream)
              peersRef.current.push({
                peerID: userID,
                peer,
              })
              peers.push(peer)
            })
            setPeers(peers)
          })

          socket.on('user joined', (payload) => {
            const peer = addPeer(payload.signal, payload.callerID, stream)
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            })

            setPeers((users) => [...users, peer])
          })

          socket.on('receiving returned signal', (payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id)
            item.peer.signal(payload.signal)
          })
          return stream
        })
        .then((stream) => {
          stream.getTracks().forEach((track) => (streamTrack.current = track))
          myVideoFeed.current = stream.getVideoTracks()[0]
          myMicFeed.current = stream.getAudioTracks()[0]
        })

    return () => {
      setPeers([])
      navigator.mediaDevices &&
        streamRef.current
          .getTracks()
          .forEach((track) => track === streamTrack.current && track.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    })

    peer.on('signal', (signal) => {
      socket.emit('sending signal', {
        userToSignal,
        callerID,
        signal,
      })
    })

    return peer
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    })

    peer.on('signal', (signal) => {
      socket.emit('returning signal', { signal, callerID })
    })

    peer.signal(incomingSignal)

    return peer
  }

  const addUserHandler = (params) => {
    console.log('clicked')
  }

  const trackHandler = (track) => {
    track.current.enabled = !track.current.enabled
  }

  const shareScreenHandler = (params) => {}

  return (
    <Container>
      <Paper elevation={12} style={{ minHeight: '80vh' }}>
        <h2 style={{ float: 'left', padding: '0 20px' }}>{roomName}</h2>
        <div style={{ float: 'right' }}>
          <AddUsers chatroomId={roomID} onClick={addUserHandler} />
        </div>
        <Grid
          spacing={2}
          container
          style={{ padding: '0px 15px', minHeight: '50vh' }}
        >
          <Grid item xs={3}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <video
                muted
                ref={userVideo}
                autoPlay
                playsInline
                height='100%'
                width='100%'
              />
            </div>
          </Grid>
          {peers.map((peer, index) => {
            return (
              <Grid item xs={3} key={index}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Video peer={peer} />
                </div>
              </Grid>
            )
          })}
        </Grid>
        <Grid item xs={12} style={{ marginTop: 'auto' }}>
          <PublicVideoControls
            setMute={() => trackHandler(myMicFeed)}
            setOffScreen={() => trackHandler(myVideoFeed)}
            setShareScreen={shareScreenHandler}
            socket={socket}
            userInfo={userInfo}
            chatroomId={roomID}
          />
        </Grid>
      </Paper>
    </Container>
  )
}
