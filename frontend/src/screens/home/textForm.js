import React from 'react'
import {
  Button,
  Card,
  Divider,
  IconButton,
  Paper,
  TextField,
} from '@material-ui/core'

import SendIcon from '@material-ui/icons/Send'
import PhoneInput from 'react-phone-input-2'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import { useForm } from 'react-hook-form'
import { useStyles } from './styles'
import { useDispatch, useSelector } from 'react-redux'

import { TA } from '../../actions/index'

export const TextForm = () => {
  const classes = useStyles()
  const dispactch = useDispatch()
  const { register, handleSubmit, errors } = useForm()

  const { info, loading, error } = useSelector((state) => state.sendText)

  const [mobileNum, setMobileNum] = React.useState()
  const [success, setSuccess] = React.useState(false)
  const [sentMsg, setSentMsg] = React.useState([])

  const submitHandler = ({ message }, event) => {
    setSentMsg((prev) => [...prev, message])
    const to = '+' + mobileNum
    dispactch(TA.sendTextMsg({ to, message }))
    event.target.reset()
  }

  React.useEffect(() => {
    if (info) {
      setSuccess(true)
    }
  }, [info])

  return (
    <>
      <Card className={classes.paper}>
        <div className={classes.cardActions}>
          <IconButton style={{ padding: 5 }}>
            <AddCircleIcon style={{ color: 'green', fontSize: 40 }} />
          </IconButton>
          <PhoneInput
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

        <Paper style={{ padding: 10, minHeight: '35vh', margin: 10 }}>
          {loading
            ? 'loading...'
            : error
            ? sentMsg.map((msg) => <p key={msg}>{msg} - not delivered</p>)
            : success
            ? sentMsg.map((msg) => <p key={msg}>{msg} - delivered</p>)
            : ''}
        </Paper>
        <form
          onSubmit={handleSubmit(submitHandler)}
          method='POST'
          encType='multipart/form-data'
          style={{ margin: 10 }}
        >
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
          >
            Send
          </Button>
        </form>
      </Card>
    </>
  )
}
