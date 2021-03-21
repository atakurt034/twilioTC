import express from 'express'
import { config } from 'dotenv'
import { error } from './middlewares/index.js'
import { mongoConnect } from './database/mongo.js'
import { createServer } from 'http'
import { Server } from 'socket.io'

import morgan from 'morgan'
import 'colors'

import userRoute from './routes/userRoute.js'

// initialize dotenv for environment variables
config()

// environment variables
const { PORT, NODE_ENV } = process.env

// initialize express
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// connect mongo
mongoConnect()

if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// API Routes
app.get('/', (req, res) => res.end('hello'))
app.use('/api/user', userRoute)

// error handlers
app.use(error.errorHandler)
app.use(error.notFound)

const server = createServer(app).listen(
  PORT,
  console.log(`Server running at PORT: ${PORT}`.yellow.bold)
)

const io = new Server(server, { cors: { origin: '*' } })

// ************* socket.io *****************//

io.on('connection', (socket) => {
  socket.emit('me', socket.id)
  console.log(socket.id)
  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded')
  })

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    })
  })

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal)
  })
})
