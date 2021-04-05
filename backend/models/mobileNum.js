import mongoose from 'mongoose'

const mobileNumSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)
export const MobileNum = mongoose.model('MobileNum', mobileNumSchema)
