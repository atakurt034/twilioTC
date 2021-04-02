import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
    },
    mobile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MobileNum',
    },
    smsrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Smsroom' }],
    privaterooms: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Privateroom' },
    ],
    chatrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom' }],
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    invites: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        chatroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom' },
        accept: { type: Boolean, default: false },
      },
    ],
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
  },
  { timestamps: true }
)

// check hash password against entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export const User = mongoose.model('User', userSchema)
