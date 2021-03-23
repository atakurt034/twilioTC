import React from 'react'
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'

import { useStyles } from './styles'

import { useSelector } from 'react-redux'

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
        console.log(data)
      })
    }
  }, [chatroomId, socket, userInfo, history])

  React.useEffect(() => {
    if (socket) {
      socket.on('privateOutput', (data) => {
        setMessages((prev) => [...prev, data])
      })
    }
  }, [socket])

  const clickHandler = () => {
    if (socket) {
      socket.emit('privateInput', {
        message: text.current.value,
        name: userInfo.name,
        image: userInfo.image,
        chatroomId,
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
          <h1>Video</h1>
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
                  return <p key={index}>{message.message}</p>
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
