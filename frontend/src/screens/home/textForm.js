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

  const [mobileNum, setMobileNum] = React.useState()
  const [country, setCountry] = React.useState()

  const changeHandler = (value, country) => {
    setMobileNum(value)
    setCountry(country.name)
  }

  const submitHandler = () => {
    dispatch(UA.searchMobile(mobileNum))
  }

  const textHandler = (mobileNumb) => {
    history.push(`/sms/${mobileNumb}`)
  }

  React.useEffect(() => {
    return () => {
      dispatch({ type: USER.SEARCH_MOBILE_RESET })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            color='primary'
            style={{ margin: 0, left: -20 }}
            onClick={submitHandler}
          >
            Search
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
      </Card>
    </>
  )
}

export const TextForm = withRouter(Text)
