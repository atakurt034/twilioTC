import asyncHandler from 'express-async-handler'
import { Chatroom } from '../models/chatroomModel.js'
import { Privateroom } from '../models/privateroomModel.js'
import { User } from '../models/userModel.js'
import mongoose from 'mongoose'

export const createPrivateRoom = asyncHandler(async (req, res) => {
  try {
    const senderId = req.user._id
    const { id: recieverId } = req.body

    const userExist = await Privateroom.findOne({
      $or: [
        { users: { $eq: [recieverId, senderId] } },
        { users: { $eq: [senderId, recieverId] } },
      ],
    })

    const users = await User.find({ _id: { $in: [recieverId, senderId] } })

    if (userExist) {
      res.status(404)
      throw new Error('Room already exist')
    }
    const newRoom = await Privateroom.create({ users })
    users.map((user) => user.privaterooms.push(user) && user.save())

    if (newRoom) {
      res.status(200)
      res.json(newRoom)
    }
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})
