import asyncHandler from 'express-async-handler'
import pkg from 'twilio'
import { Smsroom } from '../models/smsRooms.js'
import { Smsmessage } from '../models/smsMessages.js'
import { MobileNum } from '../models/mobileNum.js'
import { User } from '../models/userModel.js'
import 'colors'

const { Twilio, twiml } = pkg
const SID = process.env.TWILIO_ACCOUNT_SID
const TOKEN = process.env.TWILIO_AUTH_TOKEN
const from = process.env.TWILIO_NUMBER

/**
 * route: /api/twilio
 * description: send text message
 * access: Private
 * method: POST
 */
export const sendText = asyncHandler(async (req, res) => {
  const client = new Twilio(SID, TOKEN, { logLevel: 'debug' })
  const { message, to } = req.body
  let toUser
  let fromUser
  let smsMessage
  let smsRoom

  const toFind = to.split('+')[1]
  const fromfind = from.split('+')[1]

  try {
    await client.messages.create({
      body: message,
      from: from,
      to: to,
    })

    const user = await User.findById(req.user._id)

    toUser = await MobileNum.findOne({ mobile: toFind })

    // create a new mobile number entry
    if (!toUser) {
      toUser = await MobileNum.create({ mobile: toFind })
    }

    fromUser = user.mobile === fromfind ? user.mobile : false
    // add user mobile number to self
    if (!fromUser) {
      fromUser = await MobileNum.create({
        mobile: fromfind,
        user: req.user._id,
      })
      user.mobile = fromUser
    }

    smsRoom = await Smsroom.findOne({
      $and: [{ _id: req.user._id }, { to: toUser }],
    })

    // create new smsRoom if it does not exist
    if (!smsRoom) {
      smsRoom = await Smsroom.create({ users: [toUser, fromUser] })
    }
    smsMessage = await Smsmessage.create({
      status: 'sent',
      message,
      to: toUser,
      from: user.mobile,
    })

    // check if user has the roomSms
    let smsRoomExist
    smsRoomExist = user.smsrooms.find((room) => room._id === smsRoom._id)
    if (!smsRoomExist) {
      user.smsrooms.push(smsRoom)
    }

    smsRoom.messages.push(smsMessage)
    await user.save()
    await smsRoom.save()

    res.status(200).json(smsMessage)
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const recieveText = asyncHandler(async (req, res) => {
  try {
    const client = new twiml.MessagingResponse(SID, TOKEN, {
      logLevel: 'debug',
    })

    const { SmsStatus, Body, From } = req.body

    client.message()

    res.writeHead(200, { 'Content-Type': 'text/xml' })
    res.end(client.toString())
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const recieveCall = asyncHandler(async (req, res) => {
  try {
    const client = new twiml.VoiceResponse(SID, TOKEN, { logLevel: 'debug' })

    client.say({ voice: 'alice' }, 'hello world!')

    // Render the response as XML in reply to the webhook request
    res.type('text/xml')
    res.send(client.toString())
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})
