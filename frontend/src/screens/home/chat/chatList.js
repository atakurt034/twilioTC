import {
  Button,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core'
import React from 'react'

import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import ChatIcon from '@material-ui/icons/Chat'
import { withRouter } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { UA } from '../../../actions/index'
import { makeToast } from '../../../components/toast'

const List = ({ id, name, history, type }) => {
  const dispatch = useDispatch()

  const [focus, setFocus] = React.useState(false)

  const clickHandler = () => {
    if (type === 'Public') {
      history.push(`/public/${id}?name=${name}`)
    } else {
      history.push(`/chatroom/${id}?name=${name}`)
    }
  }
  const deleteHandler = async () => {
    let types = 'privateroom'
    if (type === 'Public') {
      types = 'chatroom'
    }
    const answer = await makeToast('delete', 'question', '', name)

    if (answer) {
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
            onMouseEnter={() => setFocus(true)}
            onMouseOut={() => setFocus(false)}
          >
            {name.length > 10 ? (
              <Tooltip disableFocusListener title={name} placement='top'>
                <Typography on>
                  {name.length > 10 ? name.slice(0, 10) + '...' : name}
                </Typography>
              </Tooltip>
            ) : (
              <Typography on>{name}</Typography>
            )}
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
