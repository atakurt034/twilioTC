import asyncHandler from 'express-async-handler'
import pkg from 'twilio'
import { Smsroom } from '../models/smsRooms.js'
import { Smsmessage } from '../models/smsMessages.js'
import { MobileNum } from '../models/mobileNum.js'
import { User } from '../models/userModel.js'

import 'colors'

const { Twilio, twiml, jwt } = pkg
const SID = process.env.TWILIO_ACCOUNT_SID
const TOKEN = process.env.TWILIO_AUTH_TOKEN
const from = process.env.TWILIO_NUMBER
const twiml_SID = process.env.TWILIO_TWIML_APP_SID

import { echoHandler } from '../index.js'

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

  const toString = await to.trim().toString().split('+')[1]
  const fromString = from.trim().toString().split('+')[1]

  try {
    await client.messages.create({
      body: message,
      from: from,
      to: to,
    })

    const user = await User.findById(req.user._id)

    fromUser = await MobileNum.findOne({ mobile: fromString })
    toUser = await MobileNum.findOne({ mobile: toString })

    const toUserExistinDB = await User.findOne({ mobile: toUser })

    // create a new mobile number entry
    if (!toUser) {
      toUser = await MobileNum.create({ mobile: toString })
      if (toUserExistinDB) {
        toUser.user = toUserExistinDB._id
      }
    }

    const fromMobileExist = user.mobile
      ? user.mobile.toString() === fromUser._id.toString()
      : false
    // add user mobile number to self
    if (!fromMobileExist) {
      fromUser = await MobileNum.create({
        mobile: fromString,
        user: req.user._id,
      })
      user.mobile = fromUser._id
    }

    smsRoom = await Smsroom.findOne({
      $or: [
        { mobiles: { $eq: [toString, fromString] } },
        { mobiles: { $eq: [fromString, toString] } },
      ],
    })
    // create new smsRoom if it does not exist
    if (!smsRoom) {
      smsRoom = await Smsroom.create({
        mobileNumbers: [toUser, fromUser],
        mobiles: [fromString, toString],
      })
    }
    smsMessage = await Smsmessage.create({
      status: 'sent',
      message,
      to: toUser,
      from: user.mobile,
      roomId: smsRoom._id,
    })

    // check if user has the roomSms
    let smsRoomExist
    smsRoomExist = user.smsrooms.includes(smsRoom._id)
    if (!smsRoomExist) {
      user.smsrooms.push(smsRoom)
    }

    smsRoom.messages.push(smsMessage)

    if (toUserExistinDB) {
      if (!toUserExistinDB.smsrooms.includes(smsRoom._id)) {
        toUserExistinDB.smsrooms.push(smsRoom)
      }
      await toUserExistinDB.save()
    }
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

    const { SmsStatus, Body, To, From } = req.body

    const chatroomId = From.trim().toString().split('+')[1]
    const to = To.trim().toString().split('+')[1]

    const toUser = await MobileNum.findOne({ mobile: to })
    const fromUser = await MobileNum.findOne({ mobile: chatroomId })

    const smsRoom = await Smsroom.findOne({
      $or: [
        { mobiles: { $eq: [chatroomId, to] } },
        { mobiles: { $eq: [to, chatroomId] } },
      ],
    })

    const msg = await Smsmessage.create({
      status: SmsStatus,
      message: Body,
      to: toUser,
      from: fromUser,
      roomId: smsRoom._id,
    })

    smsRoom.messages.push(msg)
    await smsRoom.save()

    echoHandler(chatroomId, { SmsStatus, Body, From, To }, 'incomingMessage')
    echoHandler(req.user._id, {}, 'refreshUserDetails')
    client.message('Message recieved')

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
    const dial = client.dial({ callerId: req.body.From, answerOnBridge: true })
    dial.client('Kurt')

    // Render the response as XML in reply to the webhook request
    res.type('text/xml')
    res.send(client.toString())
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

/**
 * route: /api/twilio/sms
 * description: set messages to read status
 * access: Private
 * method: PUT
 */
export const setToRead = asyncHandler(async (req, res) => {
  try {
    const roomId = req.body.id

    const smsRoom = await Smsmessage.updateMany({ roomId }, { unread: false })

    res.status(200).json(smsRoom)
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const makeCall = asyncHandler(async (req, res) => {
  try {
    const client = new twiml.VoiceResponse()
    let dial

    if (!req.body.number) {
      // incoming
      dial = client.dial({ callerId: req.body.From, answerOnBridge: true })
      dial.client('Kurt')
    } else {
      // outbound

      dial = client.dial({
        callerId: from,
        answerOnBridge: true,
        ringTone: 'us-old',
      })
      dial.number(req.body.number)
    }

    res.type('text/xml')
    res.send(client.toString())
    res.status(200)
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const getTokenCall = asyncHandler(async (req, res) => {
  try {
    const capability = new jwt.ClientCapability({
      accountSid: SID,
      authToken: TOKEN,
    })

    const scopes = [
      new jwt.ClientCapability.OutgoingClientScope({
        applicationSid: twiml_SID,
        clientName: 'Kurt',
      }),
      new jwt.ClientCapability.IncomingClientScope('Kurt'),
    ]

    scopes.forEach((scope) => capability.scopes.push(scope))

    const token = capability.toJwt()

    res.status(200).json(token)
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const callback = asyncHandler(async (req, res) => {
  try {
    console.log(req.body)

    res.type('text/xml')
    res.status(200)
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const getCallHistory = asyncHandler(async (req, res) => {
  try {
    const client = new Twilio(SID, TOKEN)
    const calls = await client.calls.list()

    res.type('text/xml')
    res.status(200).json(calls)
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const getSmsHistory = asyncHandler(async (req, res) => {
  try {
    const client = new Twilio(SID, TOKEN)
    const messages = await client.messages.page({
      pageSize: 50,
      pageNumber: req.body.page,
      pageToken: req.body.token,
    })

    res.type('text/xml')
    res.status(200).json(messages)
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})
