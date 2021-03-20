import asyncHandler from 'express-async-handler'

import User from '../models/userModel.js'
import { generateToken } from '../utils/generateToken.js'

/**
 * route: /api/user/register
 * description: register new users
 * access: public
 * method: POST
 */
export const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body

    const emailExist = await User.findOne({ email })
    if (emailExist) {
      res.status(401)
      throw new Error('Email already used')
    } else {
      const newUser = await User.create({ name, email, password })
      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id),
      })
    }
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

/**
 * route: /api/user/login
 * description: login users
 * access: public
 * method: POST
 */
export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('Invalid Email or Password')
    }
  } catch (error) {
    res.status(500)
    throw new Error(error)
  }
})

/**
 * route: /api/user/:id
 * description: login users
 * access: public
 * method: GET
 */
export const getUserDetails = asyncHandler(async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findById(id).select('-password')
    if (user) {
      res.status(200).json(user)
    }
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})
