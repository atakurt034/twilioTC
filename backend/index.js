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

// initialize dotenv for environment variables
config()

// environment variables
const { PORT, NODE_ENV, SESSION_SECRET, MONGO_URI } = process.env

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
    resave: false,
    saveUninitialized: true,
  })
)

if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// API Routes
app.get('/', async (req, res) => {})
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

io.on('connection', (socket) => {})
