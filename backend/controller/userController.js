import asyncHandler from 'express-async-handler'

import slugify from 'slugify'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'

import { User } from '../models/userModel.js'
import { Chatroom } from '../models/chatroomModel.js'
import { MobileNum } from '../models/mobileNum.js'
import { Call } from '../models/callModel.js'
let Sms = {}

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
      .populate('mobile', '-_id mobile')
      .populate({
        path: 'invites',
        populate: { path: '_id', select: 'name email' },
      })
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        mobile: user.mobile,
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
      .populate({ path: 'calls', model: 'Call' })
      .populate('mobile', 'mobile')
      .populate({
        path: 'contacts',
        select: 'name email image',
        populate: { path: 'mobile', select: '-_id mobile' },
      })
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
      .populate({
        path: 'smsrooms',
        model: 'Smsroom',
        populate: [
          {
            path: 'mobileNumbers',
            model: 'MobileNum',
            populate: { path: 'user', select: 'name' },
          },
          {
            path: 'messages',
            model: 'Smsmessage',
            populate: [
              {
                path: 'to',
                model: 'MobileNum',
                populate: { path: 'user', select: 'name' },
              },
              {
                path: 'from',
                model: 'MobileNum',
                populate: { path: 'user', select: 'name' },
              },
            ],
          },
        ],
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
    console.log('hit addcontacts')
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

    if (type === 'user') {
      const newContact = await User.findById(userId)

      const inviteExist = newContact.invites.find(
        (invite) => invite._id.toString() === user._id.toString()
      )

      const userContactExist = user.contacts.includes(userId)

      if (inviteExist) {
        newContact.invites.pull({ _id: inviteId })
      }

      if (!userContactExist) {
        user.contacts.push(newContact)
      }

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

/**
 * route: /api/user/:id
 * description: delete contact / group
 * access: Private
 * method: DELETE
 */
export const deleteContactOrGroup = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id
    const { type, deleteId } = req.body
    const user = await User.findById(userId)

    if (type === 'contacts') {
      user.contacts.pull(deleteId)
    } else if (type === 'chatroom') {
      user.chatrooms.pull(deleteId)
    } else if (type === 'privateroom') {
      user.privaterooms.pull(deleteId)
    }
    await user.save()
    res.status(200).json({ message: 'deleted' })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 * route: /api/user/logout
 * description: logout user
 * access: Private
 * method: POST
 */
export const logout = asyncHandler(async (req, res) => {
  try {
    req.logout()
    res.redirect('/')

    res.status(200).json({ message: 'disconnected' })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 * route: /api/user/sms
 * description: get users sms
 * access: Private
 * method: GET
 */
export const getSms = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    const msgs = await Sms.find({ from: user.mobile })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 * route: /api/user/:id
 * description: update user profile
 * access: Private
 * method: PUT
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, image, password, mobile } = req.body

  console.log('hit update')
  let mobileExist

  try {
    const user = await User.findById(req.user._id)
    user.name = name
    user.image = image
    user.email = email
    if (password) {
      user.password = password
    }

    mobileExist = await MobileNum.findOne({ mobile })

    if (mobileExist) {
      user.mobile = mobileExist
    }
    if (mobile) {
      user.mobile = await MobileNum.create({ mobile, user })
    }

    await user.save()
    res.json({ status: 200 })
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})

/**
 * route: /api/user/uploads/avatar
 * description: update user profile image
 * access: Private
 * method: POST
 */
export const updateAvatar = asyncHandler(async (req, res) => {
  const timestamp = new Date().toISOString().slice(0, 10)
  const __dirname = path.resolve()
  const uploadFolder = path.join(
    __dirname,
    'frontend',
    'public',
    'uploads',
    'avatar_images',
    timestamp
  )

  fs.mkdirSync(uploadFolder, { recursive: true }, function (err) {
    return console.log('dir ' + err)
  })

  const form = new formidable.IncomingForm()
  form.multiples = false
  form.maxFileSize = 30 * 1024 * 1024
  form.uploadDir = uploadFolder
  form.keepExtensions = true
  form.on('fileBegin', (name, file) => {
    file.path = path.join(uploadFolder, slugify(file.name))
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err)
    } else {
      res.json(files)
    }
  })
})

/**
 * route: /api/mobile/:id
 * description: search mobile number
 * access: Private
 * method: GET
 */
export const searchMobileNum = asyncHandler(async (req, res) => {
  try {
    const mobileNum = req.params.id

    const search = await MobileNum.find({ mobile: mobileNum }).populate(
      'user',
      'name email'
    )

    res.status(200).json(search)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

/**
 * route: /api/mobile/:id
 * description: search mobile number
 * access: Private
 * method: POST
 */
export const missedSeen = asyncHandler(async (req, res) => {
  try {
    const { callIds } = req.body

    const calls = await Call.updateMany(
      { _id: { $in: callIds } },
      { missed: false }
    )

    res.status(200).json(calls)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})
