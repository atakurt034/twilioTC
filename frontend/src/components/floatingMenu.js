import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import {
  Divider,
  Grid,
  IconButton,
  InputBase,
  Modal,
  Paper,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useDispatch, useSelector } from 'react-redux'

import { UA } from '../actions/index'
import { UserList } from './sendInvite'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  paper: {
    position: 'absolute',
    width: 400,
    height: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

export const AddUsers = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { user, loading } = useSelector((state) => state.userSearchAll)
  const chatroomId = props.chatroomId

  const [open, setOpen] = React.useState(false)
  const searchRef = React.useRef()
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    if (user) {
      setUsers(user)
    }
  }, [user])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const clickHandler = () => {
    if (searchRef.current.value.length > 0) {
      dispatch(UA.searchALL({ query: searchRef.current.value }))
      searchRef.current.value = ''
    } else {
      alert('Please inpute text')
    }
  }

  const changeHandler = (event) => {
    const { key, keyCode } = event
    if (key === 'Enter' || keyCode === 'Enter' || keyCode === 13) {
      clickHandler()
    }
  }

  const body = (
    <Paper className={classes.paper}>
      <Grid item xs={12} style={{ display: 'flex' }}>
        <InputBase
          fullWidth
          inputRef={searchRef}
          style={{ padding: 5 }}
          placeholder='Input email or name'
          onKeyUp={changeHandler}
        />
        <IconButton onClick={clickHandler}>
          <SearchIcon />
        </IconButton>
      </Grid>
      <Divider />
      <Grid item xs={12}>
        {loading
          ? 'searching...'
          : users.map((user) => (
              <UserList key={user._id} chatroomId={chatroomId} user={user} />
            ))}
      </Grid>
    </Paper>
  )

  return (
    <div className={classes.root}>
      <Fab onClick={handleOpen} variant='extended'>
        <AddIcon className={classes.extendedIcon} />
        Invite Users
      </Fab>
      <Modal
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
    </div>
  )
}
