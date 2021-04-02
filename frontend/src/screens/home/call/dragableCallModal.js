import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Draggable from 'react-draggable'
import '../../chatroom/styles.scss'
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled'

import { Button, IconButton, Paper, Typography } from '@material-ui/core'

import CallIcon from '@material-ui/icons/Call'
import MicOffIcon from '@material-ui/icons/MicOff'

import { Timer } from './timer'
import { Connecting } from './connecting'

function PaperComponent(props) {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}

export const CallModalDrag = ({
  cancel,
  to,
  mobileNum,
  open,
  ready,
  mute,
  muteHandler,
}) => {
  const [connected, setConnected] = React.useState(false)

  React.useEffect(() => {
    if (ready) {
      setTimeout(() => {
        setConnected(true)
      }, 8000)
    } else {
      setConnected(false)
    }
  }, [ready])

  const clickHandler = () => {
    cancel()
  }

  const body = (
    <div
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
      <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
        <Typography variant='h6'>
          Calling {to && to} {mobileNum && mobileNum}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
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
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          startIcon={<PhoneDisabledIcon fontSize='large' />}
          size='medium'
          onClick={clickHandler}
          color='secondary'
        >
          Cancel
        </Button>
      </DialogActions>
    </div>
  )

  const answered = (
    <div
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
      <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
        <Typography variant='h6'>
          Calling {to && to} {mobileNum && mobileNum}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {connected ? (
          <DialogContentText>
            <Timer ready={ready} />
          </DialogContentText>
        ) : (
          <DialogContentText>
            <Connecting />
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <IconButton color={mute ? 'primary' : 'default'} onClick={muteHandler}>
          <MicOffIcon fontSize='large' />
        </IconButton>
        <IconButton size='medium' onClick={clickHandler} color='secondary'>
          <PhoneDisabledIcon fontSize='large' />
        </IconButton>
      </DialogActions>
    </div>
  )

  return (
    <div>
      <Dialog
        open={typeof open === 'undefined' ? false : open}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
        style={{ width: '100%', padding: 10 }}
      >
        {ready ? answered : body}
      </Dialog>
    </div>
  )
}
