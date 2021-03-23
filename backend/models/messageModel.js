import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chatroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom' },
  },
  { timestamps: true }
)

export const Message = mongoose.model('Message', messageSchema)
