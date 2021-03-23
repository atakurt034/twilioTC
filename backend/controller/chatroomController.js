import asyncHandler from 'express-async-handler'
import { Chatroom } from '../models/chatroomModel.js'
import { User } from '../models/userModel.js'

export const createPrivateRoom = asyncHandler(async (req, res) => {
  try {
    const senderId = req.user._id
    const recieverId = req.body.id
    const { name } = req.body

    const sender = User.findById(senderId)
    const reciever = User.findById(recieverId)

    const userExist = await sender.privaterooms.find((room) =>
      room.users.includes(reciever)
    )

    if (userExist) {
      res.status(404)
      throw new Error('Room already exist')
    } else {
      const newRoom = await Chatroom.create({ name, users: [sender, reciever] })
      sender.privaterooms.push(newRoom)
      reciever.privaterooms.push(newRoom)

      if (newRoom) {
        res.status(200).json(newRoom)
      }
    }
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})
