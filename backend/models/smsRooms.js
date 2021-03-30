import mongoose from 'mongoose'

const smsRoomSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'MobileNum' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Smsmessages' }],
  },
  { timestamps: true }
)

export const Smsroom = mongoose.model('Smsroom', smsRoomSchema)
