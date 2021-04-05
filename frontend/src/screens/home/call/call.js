import React from 'react'
import {
  Card,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'

import { useStyles } from './styles'
import PhoneIcon from '@material-ui/icons/Phone'

import { _Call } from './classHelper'
import axios from 'axios'
import { Device } from 'twilio-client'
import { CallModalDrag } from './dragableCallModal'
import { useDispatch, useSelector } from 'react-redux'

import { UA } from '../../../actions/index'
import { USER } from '../../../constants/index'

import { LoadingButton } from '../../../components/loadingCallnText'
import { ModalLoader } from '../../../components/modalloader'

export const Call = () => {
  const classes = useStyles()
  const callRef = React.useRef()
  const dispatch = useDispatch()

  const { mobile, loading, error } = useSelector((state) => state.searchMobile)
  const { userDetails, loading: loadingDetails } = useSelector(
    (state) => state.userDetails
  )

  const [number, setNumber] = React.useState()
  const [open, setOpen] = React.useState()
  const [ready, setReady] = React.useState()
  const [mute, setMute] = React.useState(false)

  const [country, setCountry] = React.useState()
  const [searched, setSearched] = React.useState(false)
  const [calls, setCalls] = React.useState([])
  // const [count, setCount] = React.useState(0)

  const newCall = new _Call(axios, Device, setOpen, number, setReady, callRef)

  React.useEffect(() => {
    if (userDetails) {
      setCalls(userDetails.calls.reverse())
    }
  }, [userDetails])

  const changeHandler = (value, country) => {
    setNumber(value)
    setCountry(country.name)
    setSearched(false)
  }

  const callHandler = (num) => {
    if (num) {
      setNumber(num)
      newCall.makeCall()
    } else {
      newCall.makeCall()
    }
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
    console.log(conn.isMuted())
  }

  const backHandler = (params) => {
    setSearched(false)
    dispatch({ type: USER.SEARCH_MOBILE_RESET })
    setNumber()
  }

  const submitHandler = () => {
    dispatch(UA.searchMobile(number))
    setSearched(true)
  }

  return (
    <>
      <Card className={classes.paper}>
        <div className={classes.cardActions}>
          <PhoneInput
            value={number}
            onChange={changeHandler}
            placeholder='Input number'
            inputStyle={{ width: '100%' }}
            containerStyle={{
              margin: '1%',
            }}
            onEnterKeyPress={submitHandler}
          />

          <LoadingButton
            loading={loading}
            number={number}
            searched={searched}
            mobile={mobile}
            submitHandler={submitHandler}
            backHandler={backHandler}
          />
        </div>
        <Divider />
        <div style={{ padding: 3, overflow: 'auto', height: '85%' }}>
          {loading
            ? 'loading...'
            : error
            ? error
            : mobile &&
              mobile.map((mobile) => {
                return (
                  <Paper
                    key={mobile._id}
                    elevation={12}
                    style={{
                      padding: 5,
                      margin: 5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {mobile.user && mobile.user.name.length > 8 ? (
                      <Tooltip
                        disableFocusListener
                        title={mobile.user.name}
                        placement='top'
                      >
                        <Typography variant='body1' component='p'>
                          {mobile.user.name.slice(0, 8) + '..'}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant='body1' component='p'>
                        {mobile.user.name}
                      </Typography>
                    )}

                    <Typography variant='body1' component='p'>
                      {country}
                    </Typography>
                    <IconButton
                      style={{ color: 'green' }}
                      onClick={() => callHandler(mobile.mobile)}
                    >
                      <PhoneIcon />
                    </IconButton>
                  </Paper>
                )
              })}
          {mobile ? (
            searched &&
            mobile.length === 0 && (
              <Paper
                elevation={12}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 5,
                }}
              >
                No user found continue to call this number?{' '}
                <IconButton
                  style={{ color: 'green' }}
                  onClick={() => callHandler(number)}
                >
                  <PhoneIcon />
                </IconButton>
              </Paper>
            )
          ) : loading || loadingDetails ? (
            <ModalLoader />
          ) : (
            calls.map((call) => {
              return (
                <Paper
                  key={call._id}
                  style={{ padding: 5, margin: '10px 8px' }}
                  elevation={12}
                  className={call.missed ? classes.missed : classes.seen}
                >
                  <Typography>status: {call.status}</Typography>
                  <Typography>from: {call.from}</Typography>
                  <Typography>
                    date: {call.createdAt.toString().slice(0, 10)}
                  </Typography>
                </Paper>
              )
            })
          )}
        </div>
      </Card>
      <CallModalDrag
        cancel={cancelHandler}
        mobileNum={number}
        open={open}
        ready={ready}
        mute={mute}
        muteHandler={muteHandler}
      />
    </>
  )
}
