import React from 'react'
import { Grid, IconButton, Paper } from '@material-ui/core'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'

import { useStyles } from './styles'

import { _Call } from './classHelper'
import axios from 'axios'
import { Device } from 'twilio-client'
import { CallModalDrag } from './dragableCallModal'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'

export const Call = () => {
  const classes = useStyles()
  const callRef = React.useRef()

  const [number, setNumbers] = React.useState()
  const [open, setOpen] = React.useState()
  const [ready, setReady] = React.useState()
  const [mute, setMute] = React.useState(false)

  const newCall = new _Call(axios, Device, setOpen, number, setReady, callRef)

  const callHandler = () => {
    newCall.makeCall()
  }

  const cancelHandler = () => {
    setOpen(false)
    setReady(false)
    callRef.current.disconnectAll()
  }

  const muteHandler = async () => {
    const conn = await callRef.current.activeConnection()
    conn.mute(!conn.isMuted())
    setMute(conn.isMuted())
  }

  return (
    <Paper className={classes.paper}>
      <Grid
        container
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid item xs={12}>
          <div>
            <PhoneInput
              value={number}
              onChange={(e) => setNumbers(e)}
              enableSearch='true'
              defaultErrorMessage='input only numbers'
              placeholder='input mobile number'
              inputStyle={{ width: '85%', height: 50 }}
              containerStyle={{
                margin: 20,
              }}
            />
          </div>
        </Grid>
      </Grid>
      <CallModalDrag
        cancel={cancelHandler}
        mobileNum={number}
        open={open}
        ready={ready}
        mute={mute}
        muteHandler={muteHandler}
      />
    </Paper>
  )
}
