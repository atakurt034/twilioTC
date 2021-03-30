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

import { useForm } from 'react-hook-form'
import { useStyles } from './styles'
import { useDispatch, useSelector } from 'react-redux'

import { TA } from '../../actions/index'

export const TextForm = ({ userMobileNum }) => {
  const classes = useStyles()
  const dispactch = useDispatch()
  const { register, handleSubmit, errors } = useForm()

  const { info, loading, error } = useSelector((state) => state.sendText)

  const [mobileNum, setMobileNum] = React.useState()
  const [success, setSuccess] = React.useState(false)
  const [sentMsg, setSentMsg] = React.useState([])

  const submitHandler = ({ message }, event) => {
    setSentMsg((prev) => [...prev, { message, mobileNum }])
    const to = '+' + mobileNum
    dispactch(TA.sendTextMsg({ to, message }))
    event.target.reset()
  }

  React.useEffect(() => {
    if (info) {
      setSuccess(true)
    }
    if (userMobileNum) {
      setMobileNum(userMobileNum)
    }
  }, [info, userMobileNum])

  return (
    <>
      <Card className={classes.paper}>
        <div className={classes.cardActions}>
          <IconButton style={{ padding: 5 }}>
            <AddCircleIcon style={{ color: 'green', fontSize: 40 }} />
          </IconButton>
          <PhoneInput
            value={mobileNum}
            onChange={(e) => setMobileNum(e)}
            defaultErrorMessage='input only numbers'
            placeholder='input mobile number'
            inputStyle={{ width: '88%' }}
            containerStyle={{
              margin: '2% 0 2% 1%',
            }}
          />
        </div>
        <Divider />

        <Paper
          style={{
            padding: 10,
            height: '40vh',
            margin: 10,
            overflow: 'auto',
          }}
        >
          {loading
            ? 'sending...'
            : error
            ? sentMsg.map((msg) => (
                <Paper
                  key={msg}
                  style={{
                    maxHeight: '100%',
                    padding: 5,
                    margin: 5,
                    width: '70%',
                    border: '2px solid red',
                    float: 'right',
                    clear: 'both',
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    overflow: 'auto',
                  }}
                  elevation={12}
                >
                  <Typography style={{ color: 'red', lineHeight: '2' }}>
                    {msg.message}
                  </Typography>
                  <Typography
                    color='secondary'
                    variant='caption'
                    style={{ lineHeight: '1' }}
                  >
                    {msg.mobileNum} - not delivered
                  </Typography>
                </Paper>
              ))
            : success
            ? sentMsg.map((msg) => (
                <Paper
                  key={msg}
                  style={{
                    padding: 5,
                    margin: 5,
                    width: '70%',
                    border: '2px solid green',
                    float: 'right',
                    clear: 'both',
                    textAlign: 'right',
                  }}
                  elevation={12}
                >
                  <p>{msg.message} </p>
                  <Typography variant='caption' style={{ color: 'green' }}>
                    {msg.mobileNum} - delivered
                  </Typography>
                </Paper>
              ))
            : ''}
        </Paper>
        <form onSubmit={handleSubmit(submitHandler)} style={{ margin: 10 }}>
          <TextField
            inputRef={register({
              required: true,
              validate: (text) => text.trim().length >= 1,
            })}
            error={errors.message}
            type='text'
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Message'
            multiline
            rows={5}
            style={{ backgroundColor: '#fff' }}
            name='message'
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            size='large'
            startIcon={<SendIcon />}
            disabled={!mobileNum}
          >
            Send
          </Button>
        </form>
      </Card>
    </>
  )
}
