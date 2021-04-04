import React from 'react'
import {
  Button,
  Card,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'

import { useStyles } from './styles'
import PhoneIcon from '@material-ui/icons/Phone'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import SearchIcon from '@material-ui/icons/Search'

import { _Call } from './classHelper'
import axios from 'axios'
import { Device } from 'twilio-client'
import { CallModalDrag } from './dragableCallModal'
import { useDispatch, useSelector } from 'react-redux'

import { UA } from '../../../actions/index'
import { USER } from '../../../constants/index'

import { LoadingButton } from '../../../components/loadingCallnText'

export const Call = () => {
  const classes = useStyles()
  const callRef = React.useRef()
  const dispatch = useDispatch()

  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down('xs'))

  const { mobile, loading, error } = useSelector((state) => state.searchMobile)

  const [number, setNumber] = React.useState()
  const [open, setOpen] = React.useState()
  const [ready, setReady] = React.useState()
  const [mute, setMute] = React.useState(false)

  const [country, setCountry] = React.useState()
  const [searched, setSearched] = React.useState(false)
  // const [count, setCount] = React.useState(0)

  const newCall = new _Call(axios, Device, setOpen, number, setReady, callRef)

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
        {
          mobile
            ? searched &&
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
            : 'missed calls'
          /* !searched &&
            smsRooms.map((num) => {
              return (
                <Paper
                  elevation={12}
                  style={{ padding: 5, margin: 5 }}
                  key={num._id}
                >
                  <Button
                    fullWidth
                    variant='outlined'
                    color={count > 0 ? 'secondary' : 'default'}
                    onClick={() => textHandler(num.mobile)}
                  >
                    {num.mobile} {num.user && num.user.name}{' '}
                    {count > 0 ? `${count} - unread` : ''}
                  </Button>
                </Paper>
              )
            }) */
        }
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
