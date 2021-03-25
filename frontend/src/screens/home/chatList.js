import { Button, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import React from 'react'

import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import ChatIcon from '@material-ui/icons/Chat'
import { withRouter } from 'react-router-dom'

const List = ({ id, name, history, type }) => {
  const clickHandler = (id) => {
    if (type === 'Public') {
      history.push(`/public/${id}`)
    } else {
      history.push(`/chatroom/${id}`)
    }
  }

  return (
    <Paper elevation={12}>
      <Grid
        container
        key={id}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Grid item xs={6}>
          <Button
            startIcon={<ChatIcon fontSize='small' />}
            onClick={() => clickHandler(id, type)}
          >
            <Typography>{name}</Typography>
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Typography>{type}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton>
            <DeleteForeverIcon color='secondary' fontSize='small' />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  )
}

export const ChatList = withRouter(List)
