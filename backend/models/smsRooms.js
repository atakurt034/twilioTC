import mongoose from 'mongoose'

const smsRoomSchema = mongoose.Schema(
  {
    mobileNumbers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MobileNum' }],
    mobiles: [{ type: String }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Smsmessages' }],
  },
  { timestamps: true }
)

export const Smsroom = mongoose.model('Smsroom', smsRoomSchema)
