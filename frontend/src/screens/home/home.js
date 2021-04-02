import React from 'react'

import { IconButton, Grid } from '@material-ui/core'
import PhoneIcon from '@material-ui/icons/Phone'
import PeopleIcon from '@material-ui/icons/People'
import ChatIcon from '@material-ui/icons/Chat'
import { useStyles } from './styles.js'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'

import { SmsBadge } from './badgedIcons/smsBadge'

import { Contacts } from './contact/contact'
import { Chat } from './chat/chat'
import { Call } from './call/call'
import { SmsPanel } from './sms/smsPanel'
import { makeToast } from '../../components/toast'

export const Home = ({ socket, history }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { userDetails } = useSelector((state) => state.userDetails)
  const { status } = useSelector((state) => state.userAccept)
  const { status: statusDelete } = useSelector((state) => state.deleteAny)

  const [panel, setPanel] = React.useState('contacts')
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    socket.on('room full', () => makeToast('error', 'room is full', 'error'))
  }, [socket])

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if ((status && status.message === 'updated') || statusDelete) {
      dispatch(UA.getDetails())
    }
    dispatch(UA.getDetails())
  }, [userInfo, history, dispatch, status, statusDelete])

  const panelHandler = (type, payload) => {
    setPanel(type)
    dispatch(UA.getDetails())
  }

  React.useEffect(() => {
    const unreadCount = []
    if (userDetails) {
      userDetails.smsrooms.find((room) =>
        room.messages.map((msg) => msg.unread === true && unreadCount.push(msg))
      )
      setCount(unreadCount.length)
    }
  }, [userDetails])

  return (
    <>
      <Grid container>
        <Grid item xs={1} className={classes.sideIcons}>
          <IconButton
            className={classes.icon}
            onClick={() => panelHandler('contacts')}
          >
            <PeopleIcon />
          </IconButton>
          <IconButton
            className={classes.icon}
            onClick={() => panelHandler('chat')}
          >
            <ChatIcon />
          </IconButton>
          <IconButton
            className={classes.icon}
            onClick={() => panelHandler('call')}
          >
            <PhoneIcon />
          </IconButton>
          <IconButton
            className={classes.icon}
            onClick={() => panelHandler('sms')}
          >
            <SmsBadge count={count} />
          </IconButton>
        </Grid>
        <Grid item xs={10} lg={4} className={classes.sidePanel}>
          {panel === 'contacts' ? (
            <Contacts />
          ) : panel === 'chat' ? (
            <Chat />
          ) : panel === 'call' ? (
            <Call />
          ) : (
            <SmsPanel />
          )}
        </Grid>
      </Grid>
    </>
  )
}
