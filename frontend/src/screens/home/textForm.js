import React from 'react'
import {
  Button,
  Card,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'

import SendIcon from '@material-ui/icons/Send'
import PhoneInput from 'react-phone-input-2'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import { useStyles } from './styles'
import { useDispatch, useSelector } from 'react-redux'

import { TA } from '../../actions/index'

export const TextForm = ({ userMobileNum }) => {
  const classes = useStyles()
  const dispactch = useDispatch()

  const [mobileNum, setMobileNum] = React.useState()

  const submitHandler = ({ message }, event) => {}

  return (
    <>
      <Card className={classes.paper}>
        <div className={classes.cardActions}>
          <PhoneInput
            value={mobileNum}
            onChange={(e) => setMobileNum(e)}
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
          >
            Search
          </Button>
        </div>
        <Divider />
        list of sms
      </Card>
    </>
  )
}
