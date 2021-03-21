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

      const data = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        contacts: newUser.contacts,
        token: generateToken(newUser._id),
      }

      res.status(200).json(data)
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
    const user = await User.findOne({ email }).populate(
      'contacts',
      'name email'
    )
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        contacts: user.contacts,
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
 * access: Private
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

/**
 * route: /api/user/:id
 * description: add contacts
 * access: Private
 * method: PUT
 */

export const addContacts = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id //login user's id
    const { email } = req.body //new contact's email
    const user = await User.findById(id)
    const newContact = await User.findOne({ email })

    const contactExist = await user.contacts.includes(newContact._id)

    if (contactExist) {
      throw new Error('Already added')
    } else {
      user.contacts.push(newContact)
      await user.save()
    }
    res.status(200)
    res.json({ message: `added ${email}` })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

export const search = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email
    const userId = req.user._id

    const user = await User.findById(userId)
    const newContact = await User.findOne({ email })

    if (await user.contacts.includes(newContact._id)) {
      throw new Error('Email already added to contacts')
    } else {
      const result = await User.find({ email }).select('-password -contacts')

      res.status(200).json(result)
    }
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})
