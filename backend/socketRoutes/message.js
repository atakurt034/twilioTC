import { PrivateMessage } from '../models/privateMessageModel.js'
import { Privateroom } from '../models/privateroomModel.js'
import { Message } from '../models/messageModel.js'
import { Chatroom } from '../models/chatroomModel.js'

export const messageInput = (io, socket) => async ({
  message,
  name,
  image,
  chatroomId,
  userId,
  type,
}) => {
  if (type === 'private') {
    const newMessage = await PrivateMessage.create({
      message,
      user: userId,
      chatroom: chatroomId,
    })

    await Privateroom.updateOne(
      { _id: chatroomId },
      { $push: { messages: newMessage } }
    )
  }

  if (type === 'public') {
    const newMessage = await Message.create({
      message,
      user: userId,
      chatroom: chatroomId,
    })

    await Chatroom.updateOne(
      { _id: chatroomId },
      { $push: { messages: newMessage } }
    )
  }

  io.to(chatroomId).emit('messageOutput', {
    message,
    name,
    image,
    chatroomId,
    userId,
  })
}
