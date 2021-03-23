import React from 'react'

import { Avatar, Button, Grid, IconButton, Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'
import { USER } from '../../constants/index'

import PhoneIcon from '@material-ui/icons/Phone'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import ChatIcon from '@material-ui/icons/Chat'

export const ContactList = ({ contact, history }) => {
  const dispatch = useDispatch()

  const clickHandler = (id) => {
    history.push(`/chatroom/${id}`)
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
