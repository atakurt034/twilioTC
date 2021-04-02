import React from 'react'

import {
  Avatar,
  Container,
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
import { CallModal } from '../call/callModal'

const Contact = ({ contact, history }) => {
  const callRef = React.useRef()
  const dispatch = useDispatch()
  const { chatroom, loading, error } = useSelector(
    (state) => state.chatroomPrivateCreate
  )

  const number = contact.mobile && contact.mobile.mobile
  const [open, setOpen] = React.useState()
  const [ready, setReady] = React.useState()

  React.useEffect(() => {
    if (chatroom) {
      history.push(`/chatroom/${chatroom._id}`)
      dispatch({ type: CHAT.CREATE_PRIVATE_RESET })
    }
  }, [chatroom, dispatch, history, error])

  const clickHandler = (id) => {
    console.log(id)
    dispatch(CA.createPrivateRoom({ id }))
  }

  const deleteHandler = () => {
    if (window.confirm(`Are you sure you want to delet ${contact.name}?`))
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

  return (
    <Container
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 5,
      }}
    >
      {loading ? (
        <ModalLoader />
      ) : (
        error &&
        error !== 'Error: Room already exist' && (
          <ModalMessage variant='error'>{error}</ModalMessage>
        )
      )}
      <Paper
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
        elevation={12}
      >
        <CallModal
          cancel={cancelHandler}
          mobileNum={number}
          open={open}
          ready={ready}
        />

        <div style={{ display: 'flex', padding: 5 }}>
          <Avatar src={contact.image} alt={contact.name} />
          <Typography style={{ textAlign: 'left', padding: 5 }}>
            {contact.name}
          </Typography>
        </div>

        <div>
          <IconButton
            variant='outlined'
            onClick={() => clickHandler(contact._id)}
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
        </div>
      </Paper>
    </Container>
  )
}

export const ContactList = withRouter(Contact)
