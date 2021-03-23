import mongoose from 'mongoose'

const chatroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
)

export const Chatroom = mongoose.model('Chatroom', chatroomSchema)
