import { Button, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import React from 'react'

import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import ChatIcon from '@material-ui/icons/Chat'
import { withRouter } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { UA } from '../../../actions/index'

const List = ({ id, name, history, type }) => {
  const dispatch = useDispatch()

  const clickHandler = () => {
    if (type === 'Public') {
      history.push(`/public/${id}?name=${name}`)
    } else {
      console.log(name)
      history.push(`/chatroom/${id}`)
    }
  }
  const deleteHandler = () => {
    let types = 'privateroom'
    if (type === 'Public') {
      types = 'chatroom'
    }

    if (window.confirm(`Are you sure you wan't delete ${name}?`)) {
      dispatch(UA.deleteContactOrGroup({ type: types, deleteId: id }))
    }
  }

  return (
    <Paper elevation={12} style={{ margin: 5 }}>
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
            onClick={clickHandler}
          >
            <Typography>{name}</Typography>
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Typography>{type}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={deleteHandler}>
            <DeleteForeverIcon color='secondary' fontSize='small' />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  )
}

export const ChatList = withRouter(List)
