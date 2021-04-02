import React from 'react'
import { Grid, Paper } from '@material-ui/core'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'

import { useStyles } from './styles'
import { Dialer } from './dialer'

import { _Call } from './classHelper'
import axios from 'axios'
import { Device } from 'twilio-client'
import { CallModal } from './callModal'

export const Call = () => {
  const classes = useStyles()
  const callRef = React.useRef()

  const [number, setNumbers] = React.useState()
  const [open, setOpen] = React.useState()
  const [ready, setReady] = React.useState()

  const newCall = new _Call(axios, Device, setOpen, number, setReady, callRef)

  const callHandler = () => {
    newCall.makeCall()
  }

  const cancelHandler = () => {
    setOpen(false)
    setReady(false)
    callRef.current.disconnectAll()
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
          <PhoneInput
            value={number}
            onChange={(e) => setNumbers(e)}
            enableSearch='true'
            defaultErrorMessage='input only numbers'
            placeholder='input mobile number'
            inputStyle={{ width: 380, height: 50 }}
            containerStyle={{
              margin: 20,
            }}
          />
        </Grid>
        <Dialer
          disabled={!number}
          setNumbers={setNumbers}
          callHandler={callHandler}
        />
      </Grid>
      <CallModal
        cancel={cancelHandler}
        mobileNum={number}
        open={open}
        ready={ready}
      />
    </Paper>
  )
}
