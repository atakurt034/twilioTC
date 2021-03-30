import mongoose from 'mongoose'

const smsMessageSchema = mongoose.Schema(
  {
    status: {
      type: String,
    },
    message: {
      type: String,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MobileNum',
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MobileNum',
    },
  },
  { timestamps: true }
)
export const Smsmessage = mongoose.model('Smsmessage', smsMessageSchema)
