import express from 'express'
import { config } from 'dotenv'
import { error } from './middlewares/index.js'
import { mongoConnect } from './database/mongo.js'

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

// connect mongo
mongoConnect()

if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// API Routes
app.use('/api/user', userRoute)

// error handlers
app.use(error.errorHandler)
app.use(error.notFound)

app.listen(PORT, console.log(`Server running at PORT: ${PORT}`.yellow.bold))
