import React from 'react'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled'
import MicOffIcon from '@material-ui/icons/MicOff'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows'
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled'
import MicIcon from '@material-ui/icons/Mic'
import VideocamIcon from '@material-ui/icons/Videocam'
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff'
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes'
import { Skeletons } from '../../components/skeletons'
import SendIcon from '@material-ui/icons/Send'

import { useDispatch, useSelector } from 'react-redux'
import { CA } from '../../actions/index'
import { SendMessage, Message, OldMessage } from './classHelpers'
import { useStyles } from './styles'
import { ChatBadge } from './chatIconWithBadge'

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Typography,
} from '@material-ui/core'
import PhoneIcon from '@material-ui/icons/Phone'
import './styles.scss'

export const CallUser = ({ callUser, calling, userName, stream }) => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <IconButton
        disabled={!stream}
        style={{ border: '1px solid green', color: 'green' }}
        onClick={callUser}
      >
        <PhoneIcon />
      </IconButton>
      <Typography style={{ textAlign: 'center', padding: 5 }} variant='h6'>
        {`Call ${userName}`}
      </Typography>
    </Grid>
  )
}

export const MeCalling = ({ userName, cancelCall }) => {
  return (
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
      <Button
        color='secondary'
        variant='contained'
        startIcon={<PhoneIcon />}
        onClick={cancelCall}
      >
        Cancel Call
      </Button>
      <Typography style={{ textAlign: 'center', padding: 5 }} variant='h6'>
        {`calling ${userName}`}
      </Typography>
      <div className='snippet' data-title='.dot-pulse'>
        <div className='stage'>
          <div className='dot-pulse'></div>
        </div>
      </div>
    </Grid>
  )
}

export const UserHasCall = ({ answerCall, caller }) => {
  return (
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
      <Button
        variant='contained'
        style={{ backgroundColor: 'green', color: '#fff' }}
        onClick={answerCall}
        startIcon={<PhoneIcon />}
      >
        Answer Call
      </Button>

      <Typography
        component='span'
        style={{ textAlign: 'center', padding: 5 }}
        variant='h6'
      >
        {`${caller} is calling...`}
      </Typography>
      <div className='snippet' data-title='.dot-pulse'>
        <div className='stage'>
          <div className='dot-pulse'></div>
        </div>
      </div>
    </Grid>
  )
}

export const VideoControls = (props) => {
  const { endCall, setMute, setOffScreen } = props
  const classess = useStyles()

  const [mute, setMute1] = React.useState(false)
  const [offScreen, setOffScreen1] = React.useState(false)

  const changeHandler = (event, value) => {
    switch (value) {
      case 'offScreen':
        setOffScreen1((prev) => !prev)
        setOffScreen()
        break
      case 'mute':
        setMute1((prev) => !prev)
        setMute()
        break

      case 'end':
        endCall()
        break
      default:
        break
    }
  }

  return (
    <BottomNavigation
      {...props}
      onChange={changeHandler}
      showLabels
      className={classess.root}
    >
      <BottomNavigationAction
        value='end'
        label='End Call'
        className={classess.endCall}
        icon={<PhoneDisabledIcon />}
      />
      <BottomNavigationAction
        className={mute ? classess.muted : classess.unmuted}
        value='mute'
        label={mute ? 'unmute' : 'mute'}
        icon={mute ? <MicOffIcon /> : <MicIcon />}
      />
      <BottomNavigationAction
        value='offScreen'
        label={offScreen ? 'turn on Video' : 'turn off Video'}
        className={offScreen ? classess.muted : classess.unmuted}
        icon={offScreen ? <VideocamOffIcon /> : <VideocamIcon />}
      />
    </BottomNavigation>
  )
}

export const PublicVideoControls = ({
  setMute,
  setShareScreen,
  setOffScreen,
  userInfo,
  socket,
  chatroomId,
}) => {
  const classess = useStyles()
  const [mute, setMute1] = React.useState(false)
  const [shareScreen, setShareScreen1] = React.useState(false)
  const [offScreen, setOffScreen1] = React.useState(false)
  const [chat, setChat1] = React.useState(false)
  const [count, setCount] = React.useState(0)

  const switchHandler = (event, value) => {
    switch (value) {
      case 'offScreen':
        setOffScreen1((prev) => !prev)
        setOffScreen()
        break
      case 'mute':
        setMute1((prev) => !prev)
        setMute()
        break
      case 'screen':
        setShareScreen1((prev) => !prev)
        setShareScreen()
        break
      case 'chat':
        setChat1((prev) => !prev)
        handleOpen()
        setCount(0)
        break
      default:
        break
    }
  }

  // modal
  const dispatch = useDispatch()
  const scrollToView = React.useRef()
  const messageRef = React.useRef()
  const classes = useStyles()

  const { messages: publicMsgs, loading } = useSelector(
    (state) => state.getPublicMessage
  )

  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([])

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
    if (publicMsgs) {
      const message = publicMsgs.map((message) => {
        return new OldMessage(message, userInfo)
      })
      setMessages(message)
    }
  }, [loading, publicMsgs, userInfo])

  React.useEffect(() => {
    socket.on('messageOutput', (data) => {
      const newMessage = new Message(data, userInfo)
      setMessages((prev) => [...prev, newMessage])

      scrollToBottom()
      if (!chat) {
        setCount((prev) => ++prev)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, userInfo])

  React.useEffect(() => {
    if (!loading) {
      setTimeout(() => scrollToBottom(), 2000)
    }
  }, [loading])

  React.useEffect(() => {
    dispatch(CA.getPublicMessages(chatroomId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setChat1(false)
    setOpen(false)
    setCount(0)
  }

  const clickHandler = () => {
    if (messageRef.current.value.length > 0) {
      const newMessage = new SendMessage(
        messageRef.current.value,
        chatroomId,
        userInfo,
        socket,
        'public'
      )
      newMessage.send()
      messageRef.current.value = ''
    }
  }

  const changeHandler = (event) => {
    const { key, keyCode } = event
    if (key === 'Enter' || keyCode === 'Enter' || keyCode === 13) {
      clickHandler()
    }
  }

  const body = (
    <Card style={{ minHeight: '50vh', minWidth: '30vw' }} elevation={0}>
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
          {loading && <Skeletons variant='text' height='120px' width='90%' />}
          {messages.map((message, index) => {
            return (
              <Paper
                key={index}
                className={
                  message.myMessage() ? classes.myMessage : classes.userMessage
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
  )
  // modal

  return (
    <>
      <BottomNavigation
        onChange={switchHandler}
        showLabels
        className={classess.rootBottomNav}
      >
        <BottomNavigationAction
          value='screen'
          label={shareScreen ? 'unshare' : 'share Screen'}
          className={shareScreen ? classess.muted : classess.unmuted}
          icon={
            shareScreen ? <DesktopAccessDisabledIcon /> : <DesktopWindowsIcon />
          }
        />

        <BottomNavigationAction
          value='offScreen'
          label={offScreen ? 'turn on Video' : 'turn off Video'}
          className={offScreen ? classess.muted : classess.unmuted}
          icon={offScreen ? <VideocamOffIcon /> : <VideocamIcon />}
        />

        <BottomNavigationAction
          className={mute ? classess.muted : classess.unmuted}
          value='mute'
          label={mute ? 'unmute' : 'Mute'}
          icon={mute ? <MicOffIcon /> : <MicIcon />}
        />
        <BottomNavigationAction
          className={chat ? classess.muted : classess.unmuted}
          value='chat'
          label={chat ? 'close chat' : 'open chat'}
          icon={chat ? <SpeakerNotesIcon /> : <ChatBadge count={count} />}
        />
      </BottomNavigation>

      {/****************************************************** modal *****************/}

      <Modal
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
    </>
  )
}

export const ChatModal = ({ chatroomId, socket, userInfo }) => {}
