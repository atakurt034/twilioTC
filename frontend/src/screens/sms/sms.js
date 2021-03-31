import React from 'react'
import {
  Button,
  Card,
  Container,
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

import { ModalMessage } from '../../components/modalmessage'
import { ModalLoader } from '../../components/modalloader'

import { TA } from '../../actions/index'

export const Sms = ({ match, socket, history }) => {
  const scrollToView = React.useRef()
  const classes = useStyles()
  const dispactch = useDispatch()
  const { register, handleSubmit, errors } = useForm()
  const userMobileNum = match.params.id && match.params.id

  const { info, loading, error } = useSelector((state) => state.sendText)
  const { userInfo } = useSelector((state) => state.userLogin)
  const { userDetails, loading: loadingDetails } = useSelector(
    (state) => state.userDetails
  )

  const currentRoom =
    userDetails &&
    userDetails.smsrooms.find((room) =>
      room.mobiles.find((mobile) => mobile === userMobileNum)
    )

  const [mobileNum, setMobileNum] = React.useState()
  const [sentMsg, setSentMsg] = React.useState([])
  const [pendingMsg, setPendingMsg] = React.useState()
  const [chatroomId, setChatroomId] = React.useState()

  const scrollToBottom = () => {
    if (scrollToView.current) {
      scrollToView.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    } else {
      return
    }
  }

  const submitHandler = ({ message }, event) => {
    setPendingMsg(message)

    const to = '+' + mobileNum
    dispactch(TA.sendTextMsg({ to, message }))
    event.target.reset()
  }

  class SmsMsg {
    constructor(sms, isMine) {
      this.key = sms._id
      this.message = sms.message
      this.status = sms.status
      this.username = sms.to.user ? sms.to.user.name : sms.to.mobile
      this.mobileNum = sms.to.mobile
      this.from = sms.from
      this.isMine = isMine
    }
  }

  React.useEffect(() => {
    if (socket) {
      socket.on('incomingMessage', ({ SmsStatus, Body, From, To }) => {
        const _id = new Date().getMilliseconds()
        const response = new SmsMsg({
          _id,
          message: Body,
          status: SmsStatus,
          to: { user: { user: { name: userInfo.name } }, mobile: From },
          isMine: From === userDetails && userDetails.mobile.mobile,
        })

        setSentMsg((prev) => [...prev, response])
        scrollToBottom()
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (userDetails) {
      if (currentRoom) {
        dispactch(TA.setToRead(currentRoom._id))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    return () => {
      setSentMsg([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (info || error) {
      const newSms = new SmsMsg(
        {
          key: new Date().getMilliseconds(),
          message: pendingMsg,
          status: info ? 'sent' : error && 'not sent',
          to: { user: { user: { name: '' } }, mobile: mobileNum },
        },
        true
      )
      setSentMsg((prev) => [...prev, newSms])
      setTimeout(() => {
        scrollToBottom()
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, error])

  React.useEffect(() => {
    if (userDetails) {
      userDetails.smsrooms.find((room) =>
        // room.mobiles.includes(userMobileNum) &&
        room.messages.map(
          (msg) =>
            msg.to.mobile === userMobileNum &&
            setSentMsg((prev) => [...prev, new SmsMsg(msg, userDetails)])
        )
      )

      if (!loading && !loadingDetails) {
        setTimeout(() => {
          scrollToBottom()
        }, 1000)
      }
    }
    return () => {
      setSentMsg([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails])

  React.useEffect(() => {
    if (userMobileNum) {
      setMobileNum(userMobileNum)
      setChatroomId(userMobileNum)
    }
    if (chatroomId) {
      socket.emit('smsJoin', { chatroomId })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispactch, userMobileNum, chatroomId])

  return (
    <Container maxWidth='sm'>
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
          {loading ? (
            <ModalLoader />
          ) : (
            error && <ModalMessage variant='error'>{error}</ModalMessage>
          )}
          {sentMsg.map((msg, index) => (
            <Paper
              key={msg.key + index}
              className={msg.isMine ? classes.mine : classes.yours}
              style={{
                border:
                  msg.status === 'sent' || msg.status === 'received'
                    ? '2px solid grey'
                    : '2px solid red',
              }}
              elevation={12}
            >
              <p>{msg.message} </p>
              <Typography
                variant='caption'
                style={{ color: msg.status === 'sent' ? 'green' : 'red' }}
              >
                {msg.mobileNum} - {msg.status}
              </Typography>
              <div
                ref={scrollToView}
                style={{
                  float: 'right',
                  clear: 'both',
                  padding: 5,
                  marginTop: 20,
                }}
              ></div>
            </Paper>
          ))}
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
    </Container>
  )
}
