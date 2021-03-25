import asyncHandler from 'express-async-handler'
import { Chatroom } from '../models/chatroomModel.js'
import { Privateroom } from '../models/privateroomModel.js'
import { User } from '../models/userModel.js'
import { Message } from '../models/messageModel.js'

import mongoose from 'mongoose'

/**
 * route: /api/chatroom/private
 * description: create Private Room
 * access: Private
 * method: Post
 */
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

    if (userExist) {
      res.status(201)
      res.json(userExist)
    } else {
      const newRoom = await Privateroom.create({
        users: [recieverId, senderId],
      })
      await User.updateMany(
        { _id: { $in: [recieverId, senderId] } },
        { privaterooms: newRoom }
      )
      if (newRoom) {
        res.status(200)
        res.json(newRoom)
      }
    }
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})

/**
 * route: /api/chatroom/private/:id
 * description: get Messages
 * access: Private
 * method: Get
 */
export const getPrivateMessages = asyncHandler(async (req, res) => {
  try {
    const { id: chatroomId } = req.params

    const privateRoom = await Privateroom.findOne({
      _id: chatroomId,
    })
      .populate({
        path: 'messages',
        model: 'PrivateMessage',
        populate: {
          path: 'user',
          model: 'User',
          select: '-password -privaterooms -contacts -chatrooms',
        },
      })
      .sort({ createdAt: -1 })

    res.status(200).json(privateRoom)
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})

/**
 * route: /api/chatroom
 * description: create Public Room
 * access: Private
 * method: Post
 */
export const createPublicRoom = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id
    const { name } = req.body

    const roomExist = await Chatroom.findOne({ name })

    if (roomExist) {
      res.status(404)
      throw new Error('Room already taken')
    } else {
      const newRoom = await Chatroom.create({
        name,
        users: userId,
      })
      await User.updateOne({ _id: userId }, { $push: { chatrooms: newRoom } })

      if (newRoom) {
        res.status(200)
        res.json(newRoom)
      }
    }
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})

/**
 * route: /api/chatroom
 * description: get Public Messages
 * access: Private
 * method: Get
 */
export const getPublicMessages = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params

    const messages = await Message.find({ chatroom: id })
      .populate({
        path: 'messages',
        model: 'Message',
      })
      .populate({
        path: 'user',
        model: 'User',
        select: '-password -privaterooms -contacts -chatrooms',
      })

    res.status(200).json(messages)
  } catch (error) {
    res.status(404)
    throw new Error(error)
  }
})
