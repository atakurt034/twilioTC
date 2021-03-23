import mongoose from 'mongoose'

const privatemoomSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
)

export const Privateroom = mongoose.model('Privateroom', privatemoomSchema)
