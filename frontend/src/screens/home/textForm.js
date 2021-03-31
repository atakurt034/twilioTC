import React from 'react'
import { Button, Card, Divider, Paper, Typography } from '@material-ui/core'

import PhoneInput from 'react-phone-input-2'
import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg'

import { useStyles } from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { UA } from '../../actions/index'
import { USER } from '../../constants/index'

export const Text = ({ history }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { mobile, loading, error } = useSelector((state) => state.searchMobile)
  const { userDetails } = useSelector((state) => state.userDetails)

  const [mobileNum, setMobileNum] = React.useState()
  const [country, setCountry] = React.useState()
  const [searched, setSearched] = React.useState(false)
  const [count, setCount] = React.useState(0)

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
            placeholder='Search mobile number'
            inputStyle={{ width: '88%' }}
            containerStyle={{
              margin: '2% 0 2% 1%',
            }}
          />
          <Button
            variant='contained'
            disabled={!mobileNum}
            color='primary'
            style={{ margin: 0, left: -20 }}
            onClick={
              mobileNum
                ? searched
                  ? backHandler
                  : submitHandler
                : submitHandler
            }
          >
            {mobileNum ? (searched ? 'back' : 'search') : 'search'}
          </Button>
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
                  <Typography variant='body2'>
                    {mobile.user.name} {mobile.user.email}
                  </Typography>
                  <Typography variant='body2'>{country}</Typography>
                  <Button
                    startIcon={<PermPhoneMsgIcon />}
                    color='primary'
                    variant='contained'
                    onClick={() => textHandler(mobile.mobile)}
                  >
                    Text
                  </Button>
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
                <Button
                  startIcon={<PermPhoneMsgIcon />}
                  color='primary'
                  variant='contained'
                  onClick={() => textHandler(mobileNum)}
                >
                  Text
                </Button>
              </Paper>
            )
          : userDetails &&
            !loading &&
            userDetails.smsrooms.map((room) =>
              room.mobileNumbers.map((num) => (
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
              ))
            )}
      </Card>
    </>
  )
}

export const TextForm = withRouter(Text)
