import asyncHandler from 'express-async-handler'
import pkg from 'twilio'
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

  try {
    const result = await client.messages.create({
      body: message,
      from: from,
      to: to,
    })

    res.status(200).json(result)
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
