import React from 'react'

import {
  Avatar,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { CA, UA } from '../../../actions/index'
import { CHAT } from '../../../constants/index'

import PhoneIcon from '@material-ui/icons/Phone'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg'
import ChatIcon from '@material-ui/icons/Chat'
import { ModalLoader } from '../../../components/modalloader'
import { ModalMessage } from '../../../components/modalmessage'
import { withRouter } from 'react-router'

import { _Call } from '../call/classHelper'
import axios from 'axios'
import { Device } from 'twilio-client'
import { CallModalDrag } from '../call/dragableCallModal'

import { makeToast } from '../../../components/toast'

const Contact = ({ contact, history }) => {
  const callRef = React.useRef()
  const dispatch = useDispatch()
  const { chatroom, loading, error } = useSelector(
    (state) => state.chatroomPrivateCreate
  )

  const number = contact.mobile && contact.mobile.mobile
  const [open, setOpen] = React.useState()
  const [ready, setReady] = React.useState()
  const [mute, setMute] = React.useState(false)
  const [userName, setUserName] = React.useState()

  React.useEffect(() => {
    if (chatroom && userName) {
      history.push(`/chatroom/${chatroom._id}?name=${userName.split(' ')[0]}`)
      dispatch({ type: CHAT.CREATE_PRIVATE_RESET })
    }
  }, [chatroom, dispatch, history, error, userName])

  const clickHandler = (id, name) => {
    setUserName(name)
    dispatch(CA.createPrivateRoom({ id }))
  }

  const deleteHandler = async () => {
    const answer = await makeToast('delete', 'question', '', contact.name)

    if (answer)
      dispatch(
        UA.deleteContactOrGroup({ type: 'contacts', deleteId: contact._id })
      )
  }

  const textHandler = (mobileNum) => {
    history.push(`/sms/${mobileNum}`)
  }

  const callHandler = (params) => {
    const call = new _Call(axios, Device, setOpen, number, setReady, callRef)
    call.makeCall()
  }

  const cancelHandler = () => {
    setOpen(false)
    setReady(false)
    callRef.current.disconnectAll()
  }

  const muteHandler = async () => {
    const conn = await callRef.current.activeConnection()
    conn.mute(!conn.isMuted())
    setMute(conn.isMuted())
  }

  return (
    <>
      {loading ? (
        <ModalLoader />
      ) : (
        error &&
        error !== 'Error: Room already exist' && (
          <ModalMessage variant='error'>{error}</ModalMessage>
        )
      )}

      <Paper style={{ margin: '10px 5px' }} elevation={12}>
        <Grid container style={{ padding: 5 }}>
          <CallModalDrag
            cancel={cancelHandler}
            mobileNum={number}
            open={open}
            ready={ready}
            to={contact.name}
            mute={mute}
            muteHandler={muteHandler}
          />
          <Grid
            item
            xs={12}
            sm={4}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 5,
            }}
          >
            <Avatar src={contact.image} alt={contact.name} />
            <Typography style={{ textAlign: 'left', padding: 5 }}>
              {contact.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <IconButton
              variant='outlined'
              onClick={() => clickHandler(contact._id, contact.name)}
            >
              <ChatIcon color='primary' fontSize='small' />
            </IconButton>
            <IconButton
              onClick={callHandler}
              variant='outlined'
              disabled={contact.mobile && contact.mobile.mobile ? false : true}
            >
              <PhoneIcon
                style={{
                  color:
                    contact.mobile && contact.mobile.mobile ? 'green' : 'grey',
                }}
                fontSize='small'
              />
            </IconButton>
            <IconButton
              disabled={contact.mobile && contact.mobile.mobile ? false : true}
              variant='outlined'
              onClick={() =>
                textHandler(contact.mobile ? contact.mobile.mobile : 'none')
              }
            >
              <PermPhoneMsgIcon
                style={{
                  color:
                    contact.mobile && contact.mobile.mobile
                      ? 'goldenrod'
                      : 'grey',
                }}
                fontSize='small'
              />
            </IconButton>
            <IconButton variant='outlined' onClick={deleteHandler}>
              <DeleteForeverIcon color='secondary' fontSize='small' />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

export const ContactList = withRouter(Contact)
