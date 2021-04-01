import React from 'react'

import {
  Avatar,
  Container,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core'

import PhoneIcon from '@material-ui/icons/Phone'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

import { CallModal } from './call/callModal'

import axios from 'axios'
import { Device } from 'twilio-client'

export const PhoneDetails = ({
  contact,
  history,
  MobileNum,
  callSearch,
  setCallSearch,
}) => {
  const callRef = React.useRef()
  const number = '+' + contact.mobile ? contact.mobile.mobile : MobileNum

  const [open, setOpen] = React.useState(false)
  const [ready, setReady] = React.useState(false)

  const deleteHandler = () => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`))
      return
  }

  const getToken = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post('/api/twilio/token', config)
      const Twilio = new Device()
      Twilio.setup(data, { enableRingingState: true })

      callRef.current = Twilio
    } catch (error) {
      console.log(error)
    }
  }

  const call = async () => {
    try {
      await getToken()
      callRef.current.on('ready', () => {
        setOpen(true)
        callRef.current.connect({ number })
        setTimeout(() => setReady(true), 5000)
      })
      callRef.current.on('connect', (data) => {
        console.log('connect', data)
      })
      callRef.current.on('error', (data) => {
        console.log('error', data)
      })
      callRef.current.on('incoming', (data) => {
        console.log('incomming', data)
      })
      callRef.current.on('disconnect', (data) => {
        console.log('disconnect', data)
        setOpen(false)
        setCallSearch(false)
      })
      callRef.current.on('cancel', (data) => {
        console.log('cancel', data)
        setOpen(false)
      })
      callRef.current.on('offline', (data) => {
        console.log('offline', data)
        setOpen(false)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const cancelHandler = () => {
    setOpen(false)
    setCallSearch(false)
  }

  const callHandler = () => {
    call()
  }

  React.useEffect(() => {
    if (callSearch) {
      call()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callSearch])

  return (
    <Container
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 5,
      }}
    >
      <CallModal
        cancel={cancelHandler}
        callRef={callRef}
        open={open}
        setOpen={setOpen}
        mobileNum={contact.mobile && contact.mobile.mobile}
        name={contact.name ? contact.name : ''}
        ready={ready}
      />
      <Paper
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
        elevation={12}
      >
        <div style={{ display: 'flex', padding: 5 }}>
          <Avatar src={contact.image} alt={contact.name} />
          <Typography style={{ textAlign: 'left', padding: 5 }}>
            <>
              <b>{contact.name + '  '}</b>
              {'+' + contact.mobile.mobile}
            </>
          </Typography>
        </div>

        <div>
          <IconButton
            variant='outlined'
            disabled={contact.mobile && contact.mobile.mobile ? false : true}
            onClick={callHandler}
          >
            <PhoneIcon
              style={{
                color:
                  contact.mobile && contact.mobile.mobile
                    ? 'goldenrod'
                    : 'grey',
              }}
              fontSize='small'
            />
          </IconButton>
          <IconButton variant='outlined' onClick={deleteHandler}>
            <DeleteForeverIcon color='secondary' fontSize='small' />
          </IconButton>
        </div>
      </Paper>
    </Container>
  )
}
