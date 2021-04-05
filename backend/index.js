import express from 'express'
import { config } from 'dotenv'
import { error } from './middlewares/index.js'
import { mongoConnect } from './database/mongo.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import session from 'express-session'

import morgan from 'morgan'
import 'colors'

import userRoute from './routes/userRoute.js'
import chatroomRoute from './routes/chatroomRoute.js'
import twilioRoute from './routes/twilioRoute.js'
import auth from './routes/authRoute.js'
import { pr, pub, msg, twi } from './socketRoutes/index.js'

import passport from 'passport'
import passportConfig from './middlewares/passport.js'

// initialize dotenv for environment variables
config()
passportConfig(passport)

// environment variables
const { PORT, NODE_ENV, SESSION_SECRET, MONGO_URI, JWT_SECRET } = process.env

// initialize express
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// connect mongo
mongoConnect()

// initialize sessions
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
)

if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(passport.initialize())
app.use(passport.session())

// API Routes
app.get('/', async (req, res) => {
  res.send('connected')
})
app.use('/api/user', userRoute)
app.use('/api/chatroom', chatroomRoute)
app.use('/api/twilio', twilioRoute)
app.use('/api/auth', auth)

// error handlers
app.use(error.errorHandler)
app.use(error.notFound)

export const server = createServer(app).listen(
  PORT,
  console.log(`Server running at PORT: ${PORT}`.yellow.bold)
)

export const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
})

// ************* socket.io *****************//
io.use(async (socket, next) => {
  try {
    const userId = socket.handshake.query.userId
    const name = socket.handshake.query.name
    socket.userId = userId
    socket.name = name
    next()
  } catch (err) {
    next(err)
  }
})

export const echoHandler = (chatroomId, body, event) => {
  io.to(chatroomId).emit(event, body)
}

io.on('connection', (socket) => {
  socket.on('privateJoin', pr.privateJoin(io, socket))
  socket.on('disconnect', pr.disconnect(io, socket))
  socket.on('privateCall', pr.privateCall(io, socket))
  socket.on('messageInput', msg.messageInput(io, socket))
  socket.on('privateCallAnswer', pr.privateCallAnswer(io, socket))
  socket.on('privateCancelCall', pr.privateCancelCall(io, socket))
  socket.on('callEnd', pr.callEnd(io, socket))
  socket.on('shareScreen', pr.shareScreen(io, socket))
  socket.on('join room', pub.joinRoom(io, socket))
  socket.on('sending signal', pub.sendingSignal(io, socket))
  socket.on('returning signal', pub.returningSignal(io, socket))
  socket.on('leftRoom', pub.leftRoom(io, socket))
  socket.on('smsJoin', twi.smsJoin(io, socket))
  socket.on('login', twi.login(io, socket))
  socket.on('missedCall', twi.missedCall(io, socket))
})
