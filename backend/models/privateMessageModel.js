import mongoose from 'mongoose'

const privateMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chatroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Privateroom' },
  },
  { timestamps: true }
)

export const PrivateMessage = mongoose.model(
  'PrivateMessage',
  privateMessageSchema
)
