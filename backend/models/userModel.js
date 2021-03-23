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
    },
    password: {
      type: String,
      required: true,
    },
    privaterooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom' }],
    chatrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom' }],
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    invites: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        accept: { type: Boolean, default: false },
      },
    ],
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
