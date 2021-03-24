import React from 'react'

import {
  Avatar,
  Container,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { CA } from '../../actions/index'
import { CHAT } from '../../constants/index'

import PhoneIcon from '@material-ui/icons/Phone'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import ChatIcon from '@material-ui/icons/Chat'
import { ModalLoader } from '../../components/modalloader'
import { ModalMessage } from '../../components/modalmessage'

export const ContactList = ({ contact, history }) => {
  const dispatch = useDispatch()
  const { chatroom, loading, error } = useSelector(
    (state) => state.chatroomPrivateCreate
  )

  React.useEffect(() => {
    if (chatroom) {
      history.push(`/chatroom/${chatroom._id}`)
      dispatch({ type: CHAT.CREATE_PRIVATE_RESET })
    }

    return () => {}
  }, [chatroom, dispatch, history, error])

  const clickHandler = (id) => {
    dispatch(CA.createPrivateRoom({ id }))
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
          <IconButton variant='outlined'>
            <PhoneIcon style={{ color: 'green' }} fontSize='small' />
          </IconButton>
          <IconButton variant='outlined'>
            <DeleteForeverIcon color='secondary' fontSize='small' />
          </IconButton>
        </div>
      </Paper>
    </Container>
  )
}
