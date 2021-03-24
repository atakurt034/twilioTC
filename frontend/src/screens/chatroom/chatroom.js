import React from 'react'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'

import { useStyles } from './styles'

import { useSelector } from 'react-redux'

import { Video } from './video'

export const Chatroom = ({ match, socket, history }) => {
  const classes = useStyles()
  const chatroomId = match.params.id
  const text = React.useRef()
  const scrollToView = React.useRef()

  const { userInfo } = useSelector((state) => state.userLogin)

  const [messages, setMessages] = React.useState([])

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (socket) {
      socket.emit('private', { chatroomId })
      socket.on('privateJoin', (data) => {
        // console.log(data)
      })
    }
  }, [chatroomId, socket, userInfo, history])

  class Message {
    constructor(data) {
      this.message = data.message
      this.name = data.name
      this.image = data.image
      this.chatroomId = data.chatroomId
      this.userId = data.userId
    }
    myMessage(userInfo) {
      return this.userId === userInfo._id
    }
  }

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
    if (socket) {
      socket.on('privateOutput', (data) => {
        const message = new Message(data, userInfo)
        setMessages((prev) => [...prev, message])

        scrollToBottom()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  const clickHandler = () => {
    if (socket) {
      socket.emit('privateInput', {
        message: text.current.value,
        name: userInfo.name,
        image: userInfo.image,
        chatroomId,
        userId: userInfo._id,
      })
      text.current.value = ''
    }
  }

  const changeHandler = (event) => {
    const { key, keyCode } = event
    if (key === 'Enter' || keyCode === 'Enter' || keyCode === 13) {
      clickHandler()
    }
  }

  return (
    <Container style={{ marginTop: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Video socket={socket} chatroomId={chatroomId} />
        </Grid>
        <Grid item xs={4}>
          <Card style={{ minHeight: '70vh' }}>
            <CardHeader
              title={'Chatroom'}
              subheader={new Date().toDateString()}
            />
            <CardContent style={{ height: '50vh' }}>
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
                        message.myMessage(userInfo)
                          ? classes.myMessage
                          : classes.userMessage
                      }
                    >
                      <div>
                        {!message.myMessage(userInfo) && (
                          <>
                            <Chip
                              size='small'
                              style={{ border: 'none', background: 'none' }}
                              avatar={
                                <Avatar
                                  src={message.image}
                                  alt={message.name}
                                />
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
                  autoFocus={true}
                  inputRef={text}
                  className={classes.input}
                  placeholder={'Type Here'}
                  type='text'
                  onKeyUp={changeHandler}
                />
                <IconButton className={classes.iconButton}>
                  <SendIcon />
                </IconButton>
              </Paper>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
