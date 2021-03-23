import React from 'react'

import { Avatar, Grid, IconButton, Typography } from '@material-ui/core'
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

  const [id, setId] = React.useState('')

  React.useEffect(() => {
    if ((chatroom && id) || error === 'Error: Room already exist') {
      history.push(`/chatroom/${id}`)
      dispatch({ type: CHAT.CREATE_PRIVATE_RESET })
    }
    return () => {}
  }, [chatroom, dispatch, history, id, error])

  const clickHandler = (id) => {
    dispatch(CA.createPrivateRoom({ id }))
    setId(id)
  }

  return (
    <Grid
      container
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
      <Grid item xs={8} style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={contact.image} alt={contact.name} />
        <Typography style={{ textAlign: 'left', padding: 5 }}>
          {contact.name}
        </Typography>
      </Grid>
      <Grid item xs={4}>
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
      </Grid>
    </Grid>
  )
}
