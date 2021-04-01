import React from 'react'

import CallIcon from '@material-ui/icons/Call'
import MicOffIcon from '@material-ui/icons/MicOff'

import {
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Typography,
} from '@material-ui/core'
// import { useDispatch, } from 'react-redux'

import '../../screens/chatroom/styles.scss'

export const Incoming = ({
  open,
  setOpen,
  connectionRef,
  cancel,
  twilioRef,
}) => {
  const name = connectionRef.current && connectionRef.current.parameters.From

  const [answer, setAnswer] = React.useState(false)

  const clickHandler = (type) => {
    if (type === 'reject') {
      connectionRef.current.reject()
      cancel()
      setAnswer(false)
    } else {
      setAnswer(true)
      connectionRef.current.accept()
    }
  }

  const endHandler = (params) => {
    setOpen(false)
    twilioRef.current.disconnectAll()
  }

  const answered = (
    <Paper
      style={{
        backgroundColor: 'grey',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '20vh',
        minWidth: '25vw',
        padding: 10,
      }}
    >
      <Divider />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CallIcon
          style={{
            color: 'green',
            padding: 5,
            fontSize: 40,
            margin: '5px 15px 5px 0',
          }}
        />
        <div className='snippet' data-title='.dot-pulse'>
          <div className='stage'>
            <div className='dot-pulse'></div>
          </div>
        </div>
      </div>
      Connecting please wait...
      <IconButton>
        <MicOffIcon />
      </IconButton>
      <Button onClick={endHandler} variant='contained' color='secondary'>
        End Call
      </Button>
    </Paper>
  )

  const body = (
    <Paper
      style={{
        backgroundColor: 'grey',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '15vh',
        minWidth: '15vw',
        padding: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CallIcon
          style={{
            color: 'green',
            padding: 5,
            fontSize: 40,
            margin: '5px 15px 5px 0',
          }}
        />
        <div className='snippet' data-title='.dot-pulse'>
          <div className='stage'>
            <div className='dot-pulse'></div>
          </div>
        </div>
      </div>
      <Typography variant='h6'>Incoming call from {name && name}</Typography>
      <Divider />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={() => clickHandler('accept')}
          variant='contained'
          color='primary'
        >
          Accept
        </Button>
        <Button
          onClick={() => clickHandler('reject')}
          variant='contained'
          color='secondary'
        >
          Reject
        </Button>
      </div>
    </Paper>
  )

  return (
    <Modal
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      open={open}
      // onClose={handleClose}
    >
      {answer ? answered : body}
    </Modal>
  )
}
