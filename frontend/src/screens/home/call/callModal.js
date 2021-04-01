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

import '../../chatroom/styles.scss'

export const CallModal = ({
  open,
  setOpen,
  name,
  mobileNum,
  callRef,
  cancel,
  ready,
}) => {
  const clickHandler = () => {
    callRef.current.disconnectAll()
    cancel()
  }

  React.useEffect(() => {
    if (callRef.current) {
      console.log(callRef.current.status())
    }
  }, [callRef])

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
      <Button onClick={clickHandler} variant='contained' color='secondary'>
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
      <Typography variant='h6'>
        Calling {name && name} {mobileNum && mobileNum}
      </Typography>
      <Divider />
      <Button onClick={clickHandler} variant='contained' color='secondary'>
        Cancel
      </Button>
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
      {ready ? answered : body}
    </Modal>
  )
}
