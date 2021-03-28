import React from 'react'
import Peer from 'simple-peer'

import { Container, Grid, Paper } from '@material-ui/core'
import { PublicVideoControls, Video } from './videoComponents'

import { useSelector } from 'react-redux'

import { AddUsers } from '../../components/floatingMenu'

import { GetPermission } from './classHelpers'

export const PublicChatroom = ({ match, location, socket, history }) => {
  const myVideoRef = React.useRef()
  const peersRef = React.useRef([])
  const myMicFeed = React.useRef()
  const myVideoFeed = React.useRef()

  const roomID = match.params.id
  const roomName = location.search
    .split('=')[1]
    .replace(/%20/g, ' ')
    .toUpperCase()

  const [peers, setPeers] = React.useState([])

  const { userInfo } = useSelector((state) => state.userLogin)

  const listener = (eventName, ...args) => {
    console.log(eventName, args)
  }

  socket.onAny(listener)

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
  }, [userInfo, history, socket, roomID])

  // eslint-disable-next-line no-unused-vars

  React.useEffect(() => {
    const permission = new GetPermission(myMicFeed, myVideoFeed, myVideoRef)

    navigator.mediaDevices &&
      userInfo &&
      permission.getStreams().then((stream) => {
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream
        }
        socket.emit('join room', {
          roomID,
          name: userInfo.name,
        })

        socket.on('all users', ({ id }) => {
          const peersArray = []
          id.forEach((userID) => {
            const peer = createPeer(userID, socket.id, stream)
            peersRef.current.push({
              peerID: userID,
              peer,
            })
            peersArray.push({ peerID: socket.id, peer })
          })
          setPeers(peersArray)
        })

        socket.on('user joined', (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream)
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          })
          const peerObj = { peerID: payload.callerID, peer }
          setPeers((users) => [...users, peerObj])
        })

        socket.on('receiving returned signal', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id)
          item.peer.signal(payload.signal)
        })

        socket.on('left', (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id)
          if (peerObj) {
            peerObj.peer.destroy()
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id)
          setPeers(peers)
        })
      })

    return () => {
      socket.emit('leftRoom', { chatroomId: roomID })
      permission.closeStreams()
      setTimeout(() => {
        window.location.reload()
      }, 1000)
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
                ref={myVideoRef}
                autoPlay
                playsInline
                height='100%'
                width='100%'
              />
            </div>
          </Grid>
          {peers.map((peer) => {
            return (
              <Grid item xs={3} key={peer.peerID}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Video peer={peer.peer} />
                </div>
              </Grid>
            )
          })}
        </Grid>
        <Grid item xs={12} style={{ marginTop: 'auto' }}>
          <PublicVideoControls
            setMute={() => trackHandler(myMicFeed)}
            setOffScreen={() => trackHandler(myVideoFeed)}
            socket={socket}
            userInfo={userInfo}
            chatroomId={roomID}
          />
        </Grid>
      </Paper>
    </Container>
  )
}
