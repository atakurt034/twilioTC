import asyncHandler from 'express-async-handler'

import { User } from '../models/userModel.js'
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
        invites: newUser.invites,
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
    const user = await User.findOne({ email })
      .populate('contacts', 'name email')
      .populate({
        path: 'invites',
        populate: { path: '_id', select: 'name email' },
      })
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        contacts: user.contacts,
        invites: user.invites,
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
    const user = await User.findById(id)
      .select('-password')
      .populate('contacts', 'name email')
      .populate({
        path: 'invites',
        populate: { path: '_id', select: 'name email' },
      })
      .populate({
        path: 'privaterooms',
        populate: { path: 'users', select: 'name' },
      })
    res.status(200).json(user)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 * route: /api/user/invite
 * description: add contacts
 * access: Private
 * method: PUT
 */
export const addContacts = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user //login user's id
    const { email } = req.body //new contact's email
    const user = await User.findById(_id)
    const newContact = await User.findOne({ email })

    const contactExist = await user.contacts.includes(newContact._id)
    const inviteExist = await newContact.invites.find(
      (invite) => invite._id.toString() === user._id.toString()
    )

    if (contactExist) {
      res.status(301).json({ message: 'already added' })
    } else if (inviteExist) {
      res.status(303).json({ message: 'pending' })
    } else {
      newContact.invites.push(user)
      await newContact.save()
    }
    res.status(200)
    res.json({ message: `added ${email}` })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 * route: /api/user
 * description: search contacts
 * access: Private
 * method: POST
 */
export const search = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email
    const userId = req.user._id

    const user = await User.findById(userId)
    const newContact = await User.findOne({ email })

    if (await user.contacts.includes(newContact._id)) {
      res.status(301)
      res.json({ message: 'added' })
    } else {
      const result = await User.find({ email }).select('-password -contacts')

      res.status(200).json(result)
    }
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 * route: /api/user
 * description: accept invite
 * access: Private
 * method: PUT
 */
export const acceptInvite = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user //my id
    const { id } = req.body //invite id
    const user = await User.findById(_id)
    const newContact = await User.findById(id)

    const inviteExist = newContact.invites.find(
      (invite) => invite._id.toString() === user._id.toString()
    )

    user.invites.pull({ _id: id })
    user.contacts.push(newContact)
    newContact.contacts.push(user)

    if (inviteExist) {
      newContact.invites.pull({ _id: user._id })
    }

    await user.save()
    await newContact.save()
    res.status(200)
    res.json({ message: 'updated' })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})
