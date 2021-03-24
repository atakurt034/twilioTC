import { PrivateMessage } from '../models/privateMessageModel.js'
import { Privateroom } from '../models/privateroomModel.js'

export const privateJoin = (io, socket) => async ({ chatroomId }) => {
  socket.join(chatroomId)
  io.to(chatroomId).emit('privateJoin', { userId: socket.userId })
}

export const privateInput = (io, socket) => async ({
  message,
  name,
  image,
  chatroomId,
  userId,
}) => {
  const newMessage = await PrivateMessage.create({
    message,
    user: userId,
    chatroom: chatroomId,
  })

  await Privateroom.updateOne(
    { _id: chatroomId },
    { $push: { messages: newMessage } }
  )

  io.to(chatroomId).emit('privateOutput', {
    message,
    name,
    image,
    chatroomId,
    userId,
  })
}

export const privateCall = (io, socket) => async ({
  chatroomId,
  signal,
  caller,
  callerId,
}) => {
  io.to(chatroomId).emit('privateCalling', {
    chatroomId,
    signal,
    caller,
    callerId,
  })
}

export const privateCallAnswer = (io, socket) => async ({
  chatroomId,
  signal,
}) => {
  io.to(chatroomId).emit('privateCallAnswered', {
    signal,
  })
}

export const privateCancelCall = (io, socket) => async ({ chatroomId, id }) => {
  io.to(chatroomId).emit('privateCallCancelled', {
    chatroomId,
    id,
  })
}
export const callEnd = (io, socket) => async ({ chatroomId, id }) => {
  io.to(chatroomId).emit('callEnded')
}
