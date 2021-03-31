import mongoose from 'mongoose'

const smsMessageSchema = mongoose.Schema(
  {
    status: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MobileNum',
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MobileNum',
    },
    unread: {
      type: Boolean,
      default: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Smsroom',
      required: true,
    },
  },
  { timestamps: true }
)
export const Smsmessage = mongoose.model('Smsmessage', smsMessageSchema)
