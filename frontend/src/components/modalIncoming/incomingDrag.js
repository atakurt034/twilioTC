import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Draggable from 'react-draggable'
import '../../screens/chatroom/styles.scss'
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled'

import { Button, IconButton, Paper, Typography } from '@material-ui/core'

import CallIcon from '@material-ui/icons/Call'
import MicOffIcon from '@material-ui/icons/MicOff'

import { Timer } from '../../screens/home/call/timer'

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

export const Incoming = ({
  open,
  connectionRef,
  cancel,
  mute,
  muteHandler,
  accept,
  reject,
  answer,
}) => {
  const name = connectionRef.current && connectionRef.current.parameters.From

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
        <Typography component='div'>
          Incoming call from {name && name}
        </Typography>
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={accept} variant='contained' color='primary'>
          Accept
        </Button>
        <Button onClick={reject} variant='contained' color='secondary'>
          Reject
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
        <Typography variant='h6'>{name && name}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Timer ready={answer} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <IconButton color={mute ? 'primary' : 'default'} onClick={muteHandler}>
          <MicOffIcon fontSize='large' />
        </IconButton>
        <IconButton size='medium' onClick={cancel} color='secondary'>
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
        style={{ width: '100%', padding: 10 }}
      >
        {answer ? answered : body}
      </Dialog>
    </div>
  )
}
