import asyncHandler from 'express-async-handler'

import { User } from '../models/userModel.js'
import { Chatroom } from '../models/chatroomModel.js'
import { generateToken } from '../utils/generateToken.js'

import { Query } from './queryUsers.js'

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
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'chatroom', select: 'name _id' },
        ],
      })
      .populate({
        path: 'privaterooms',
        populate: { path: 'users', select: 'name' },
      })
      .populate({
        path: 'chatrooms',
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
      newContact.invites.push({ user })
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
    const newContact = await User.find({
      $or: [...Query(email)],
    }).select('-password -contacts -chatrooms -privaterooms')

    if (await user.contacts.includes(newContact._id)) {
      res.status(301)
      res.json({ message: 'added' })
    } else {
      res.status(200).json(newContact)
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
    const { userId, inviteId, chatroomId, type } = req.body //invite id
    const user = await User.findById(_id)
    console.log(userId, inviteId, chatroomId, type)

    if (type === 'user') {
      const newContact = await User.findById(userId)
      const inviteExist = newContact.invites.find(
        (invite) => invite._id.toString() === user._id.toString()
      )
      if (inviteExist) {
        newContact.invites.pull({ _id: inviteId })
      }
      user.contacts.push(newContact)
      newContact.contacts.push(user)
      user.invites.pull({ _id: inviteId })
      await newContact.save()
      await user.save()
    } else if (type === 'chatroom') {
      const chatroom = await Chatroom.findById(chatroomId)

      user.chatrooms.push(chatroom)
      user.invites.pull({ _id: inviteId })
      await user.save()
    }

    res.status(200)
    res.json({ message: 'updated' })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 * route: /api/user/invite
 * description: search users
 * access: Private
 * method: POST
 */
export const userSearch = asyncHandler(async (req, res) => {
  try {
    const query = req.body.query

    const user = await User.find({
      $or: [...Query(query)],
    }).select('-password -contacts -chatrooms -privaterooms')

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
export const sendInvite = asyncHandler(async (req, res) => {
  try {
    const { id, chatroomId } = req.body //new contact's email
    const contacts = await User.findById(id).select('-password -privaterooms')

    const alreadyInTheRoom = await contacts.chatrooms.find(
      (chatroom) => chatroom.toString() === chatroomId.toString()
    )

    const pendingInvite = await contacts.invites.find(
      (invite) => invite.chatroom.toString() === chatroomId.toString()
    )
    if (alreadyInTheRoom) {
      throw new Error('Already Added to the Room')
    }
    if (pendingInvite) {
      throw new Error('Pending invite')
    }
    const chatroom = await Chatroom.findById(chatroomId)

    contacts.invites.push({ chatroom })
    const inviteSent = await contacts.save()
    res.status(200).json(inviteSent)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})
