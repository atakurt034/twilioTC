import React from 'react'
import {
  Button,
  Card,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core'

import PhoneInput from 'react-phone-input-2'
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg'
import TextsmsIcon from '@material-ui/icons/Textsms'

import { useStyles } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { UA } from '../../../actions/index'
import { USER } from '../../../constants/index'
import { LoadingButton } from '../../../components/loadingCallnText'

const Text = ({ history }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { mobile, loading, error } = useSelector((state) => state.searchMobile)
  const { userDetails } = useSelector((state) => state.userDetails)

  const [mobileNum, setMobileNum] = React.useState()
  const [country, setCountry] = React.useState()
  const [searched, setSearched] = React.useState(false)
  const [count, setCount] = React.useState(0)

  const [smsRooms, setSmsRooms] = React.useState([])

  const changeHandler = (value, country) => {
    setMobileNum(value)
    setCountry(country.name)
    setSearched(false)
  }

  const submitHandler = () => {
    dispatch(UA.searchMobile(mobileNum))
    setSearched(true)
  }

  const textHandler = (mobileNumb) => {
    history.push(`/sms/${mobileNumb}`)
  }

  const backHandler = (params) => {
    setSearched(false)
    dispatch({ type: USER.SEARCH_MOBILE_RESET })
    setMobileNum()
  }

  React.useEffect(() => {
    dispatch(UA.getDetails())
    return () => {
      dispatch({ type: USER.SEARCH_MOBILE_RESET })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (userDetails && !loading) {
      const rooms = []
      userDetails.smsrooms.find((room) =>
        room.mobileNumbers.map(
          (num) => num.mobile !== userDetails.mobile.mobile && rooms.push(num)
        )
      )
      setSmsRooms(rooms)
    }
  }, [loading, userDetails])

  React.useEffect(() => {
    const unreadCount = []
    if (userDetails) {
      userDetails.smsrooms.map((room) =>
        room.messages.map((msg) => msg.unread === true && unreadCount.push(msg))
      )
      setCount(unreadCount.length)
    }
  }, [userDetails])

  return (
    <>
      <Card className={classes.paper}>
        <div className={classes.cardActions}>
          <PhoneInput
            value={mobileNum}
            onChange={changeHandler}
            placeholder='Input number'
            inputStyle={{ width: '100%' }}
            containerStyle={{
              margin: '1%',
            }}
            onEnterKeyPress={submitHandler}
          />
          <LoadingButton
            backHandler={backHandler}
            loading={loading}
            mobile={mobile}
            number={mobileNum}
            searched={searched}
            submitHandler={submitHandler}
          />
        </div>
        <Divider />
        <div style={{ overflow: 'auto', maxHeight: '85%' }}>
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
                      onClick={() => textHandler(mobile.mobile)}
                    >
                      <TextsmsIcon />
                    </IconButton>
                  </Paper>
                )
              })}
          {mobile
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
                  No user found continue to send a text?{' '}
                  <IconButton
                    style={{ color: 'green' }}
                    onClick={() => textHandler(mobileNum)}
                  >
                    <TextsmsIcon />
                  </IconButton>
                </Paper>
              )
            : !searched &&
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
              })}
        </div>
      </Card>
    </>
  )
}

export const SmsPanel = withRouter(Text)
