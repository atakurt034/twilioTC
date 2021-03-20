import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import { config } from 'dotenv'
config()

// Middleware to require users to  login and use tokens to verify
export const loginRequired = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1]
      if (token) {
        const decodedId = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedId.id).select('-password')
        if (user) {
          next()
        } else {
          res.status(401)
          throw new Error('Not Authorized')
        }
      }
    } else {
      res.status(401)
      throw new Error('No token')
    }
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

// only admin users allowed
export const adminOnly = (req, res, next) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not an Admin')
  }
}
