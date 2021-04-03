import mongoose from 'mongoose'
import { config } from 'dotenv'
config()

export const mongoConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.info(`MongoDB connected to ${connect.connection.name}`)
  } catch (error) {
    throw new Error(error)
  }
}
