import { Button, IconButton, Paper, Typography } from '@material-ui/core'
import React from 'react'

import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import ChatIcon from '@material-ui/icons/Chat'
import { withRouter } from 'react-router-dom'

const List = ({ id, name, history }) => {
  const clickHandler = (id) => {
    history.push(`/chatroom/${id}`)
  }

  return (
    <Paper
      style={{
        display: 'flex',
        padding: 5,
        margin: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      key={id}
      elevation={12}
    >
      <Button
        startIcon={<ChatIcon fontSize='small' />}
        onClick={() => clickHandler(id)}
      >
        <Typography style={{ marginLeft: 5 }}>{name}</Typography>
      </Button>
      <IconButton>
        <DeleteForeverIcon color='secondary' fontSize='small' />
      </IconButton>
    </Paper>
  )
}

export const ChatList = withRouter(List)
