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

const Video = (props) => {
  const ref = React.useRef()

  React.useEffect(() => {
    props.peer.on('stream', (stream) => {
      ref.current.srcObject = stream
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <video
      playsInline
      mute={props.mute}
      autoPlay
      ref={ref}
      width='100%'
      height='100%'
    />
  )
}

export const PublicChatroom = ({ match, socket }) => {
  const messageRef = React.useRef()
  const scrollToView = React.useRef()
  const classes = useStyles()
  const dispatch = useDispatch()
  const [peers, setPeers] = React.useState([])

  const { userInfo } = useSelector((state) => state.userLogin)
  const { messages: publicMsgs } = useSelector(
    (state) => state.getPublicMessage
  )

  const [mute, setMute] = React.useState(false)
  const [muteUser, setMuteUser] = React.useState(false)
  const [shareScreen, setShareScreen] = React.useState()
  const [offScreen, setOffScreen] = React.useState()
  const [users, setUsers] = React.useState([])
  const [messages, setMessages] = React.useState([])

  const userVideo = React.useRef()
  const peersRef = React.useRef([])
  const streamTrack = React.useRef()
  const streamRef = React.useRef()
  const roomID = match.params.id

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
  }, [publicMsgs, userInfo])

  React.useEffect(() => {
    socket.on('messageOutput', (data) => {
      const newMessage = new Message(data, userInfo)
      setMessages((prev) => [...prev, newMessage])
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
        })
        .then(() => {
          streamRef.current
            .getTracks()
            .forEach((track) => (streamTrack.current = track))
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

  const sendHandler = () => {
    const message = new SendMessage(
      messageRef.current.value,
      roomID,
      userInfo,
      socket,
      'public'
    )
    message.send()
  }

  return (
    <Container>
      <Paper>
        <Grid spacing={2} container style={{ padding: '0px 15px' }}>
          <Grid item xs={3}>
            <video
              muted={mute}
              ref={userVideo}
              autoPlay
              playsInline
              height='100%'
              width='100%'
            />
            <div style={{ position: 'relative', top: -100 }}>
              <PublicVideoControls
                setMute={setMute}
                setOffScreen={setOffScreen}
                setShareScreen={setShareScreen}
                type='myVideo'
              />
            </div>
          </Grid>
          {peers.map((peer, index) => {
            return (
              <Grid item xs={3} key={index}>
                <Video peer={peer} mute={mute} />
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
              />
              <IconButton className={classes.iconButton} onClick={sendHandler}>
                <SendIcon />
              </IconButton>
            </Paper>
          </CardActions>
        </Card>
      </Paper>
    </Container>
  )
}
