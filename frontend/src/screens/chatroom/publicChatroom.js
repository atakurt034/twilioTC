import React from 'react'
import Peer from 'simple-peer'

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core'
import { useStyles } from './styles'
import SendIcon from '@material-ui/icons/Send'
import { PublicVideoControls } from './videoComponents'

import { useSelector, useDispatch } from 'react-redux'
import { CA } from '../../actions/index'
import { SendMessage, Message, OldMessage } from './classHelpers'

import { AddUsers } from '../../components/floatingMenu'
import { Skeletons } from '../../components/skeletons'

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

export const PublicChatroom = ({ match, location, socket }) => {
  const messageRef = React.useRef()
  const scrollToView = React.useRef()
  const userVideo = React.useRef()
  const peersRef = React.useRef([])
  const streamTrack = React.useRef()
  const streamRef = React.useRef()
  const myMicFeed = React.useRef()
  const myVideoFeed = React.useRef()

  const classes = useStyles()
  const dispatch = useDispatch()
  const [peers, setPeers] = React.useState([])

  const { userInfo } = useSelector((state) => state.userLogin)
  const { messages: publicMsgs, loading } = useSelector(
    (state) => state.getPublicMessage
  )

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const [offScreen, setOffScreen] = React.useState()
  const [users, setUsers] = React.useState([])
  const [messages, setMessages] = React.useState([])

  const roomID = match.params.id
  const roomName = location.search
    .split('=')[1]
    .replace(/%20/g, ' ')
    .toUpperCase()

  const scrollToBottom = () => {
    if (scrollToView.current) {
      scrollToView.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    } else {
      return
    }
  }

  React.useEffect(() => {
    dispatch(CA.getPublicMessages(roomID))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (publicMsgs) {
      const message = publicMsgs.map((message) => {
        return new OldMessage(message, userInfo)
      })
      setMessages(message)
    }
    if (!loading) {
      setTimeout(() => scrollToBottom(), 2000)
    }
  }, [loading, publicMsgs, userInfo])

  React.useEffect(() => {
    socket.on('messageOutput', (data) => {
      const newMessage = new Message(data, userInfo)
      setMessages((prev) => [...prev, newMessage])

      scrollToBottom()
    })
  }, [socket, userInfo])

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

          socket.on('all users', ({ id, name }) => {
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
            setUsers(users)
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

  const clickHandler = () => {
    const newMessage = new SendMessage(
      messageRef.current.value,
      roomID,
      userInfo,
      socket,
      'public'
    )
    newMessage.send()
    messageRef.current.value = ''
  }

  const changeHandler = (event) => {
    const { key, keyCode } = event
    if (key === 'Enter' || keyCode === 'Enter' || keyCode === 13) {
      clickHandler()
    }
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
      <Paper>
        <h2 style={{ float: 'left', padding: '0 20px' }}>{roomName}</h2>
        <div style={{ float: 'right' }}>
          <AddUsers chatroomId={roomID} onClick={addUserHandler} />
        </div>
        <Grid spacing={2} container style={{ padding: '0px 15px' }}>
          <Grid item xs={3}>
            <video
              muted
              ref={userVideo}
              autoPlay
              playsInline
              height='100%'
              width='100%'
            />
            <div style={{ position: 'relative', top: -100 }}>
              <PublicVideoControls
                setMute={() => trackHandler(myMicFeed)}
                setOffScreen={() => trackHandler(myVideoFeed)}
                setShareScreen={shareScreenHandler}
              />
            </div>
          </Grid>
          {peers.map((peer, index) => {
            return (
              <Grid item xs={3} key={index}>
                <Video peer={peer} />
              </Grid>
            )
          })}
        </Grid>
        <Card style={{ minHeight: '50vh' }} elevation={0}>
          <CardContent style={{ height: '30vh' }}>
            <Paper
              variant='outlined'
              style={{
                height: '100%',
                overflow: 'auto',
                padding: 5,
                textAlign: 'right',
              }}
            >
              {loading && (
                <Skeletons variant='text' height='120px' width='90%' />
              )}
              {messages.map((message, index) => {
                return (
                  <Paper
                    key={index}
                    className={
                      message.myMessage()
                        ? classes.myMessage
                        : classes.userMessage
                    }
                  >
                    <div>
                      {!message.myMessage() && (
                        <>
                          <Chip
                            size='small'
                            style={{ border: 'none', background: 'none' }}
                            avatar={
                              <Avatar src={message.image} alt={message.name} />
                            }
                          />
                          {message.name}
                        </>
                      )}
                    </div>
                    <p>{message.message}</p>
                    <div
                      ref={scrollToView}
                      style={{ float: 'right', clear: 'both' }}
                    ></div>
                  </Paper>
                )
              })}
            </Paper>
          </CardContent>
          <CardActions>
            <Paper className={classes.root}>
              <InputBase
                inputRef={messageRef}
                autoFocus={true}
                className={classes.input}
                placeholder={'Type Here'}
                type='text'
                onKeyUp={changeHandler}
              />
              <IconButton className={classes.iconButton} onClick={clickHandler}>
                <SendIcon />
              </IconButton>
            </Paper>
          </CardActions>
        </Card>
      </Paper>
    </Container>
  )
}
