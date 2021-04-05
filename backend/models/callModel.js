import mongoose from 'mongoose'

const callSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },

    missed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)
export const Call = mongoose.model('Call', callSchema)
