import { User } from '../models/userModel.js'
import { Call } from '../models/callModel.js'

export const smsJoin = (io, socket) => async ({ chatroomId }) => {
  socket.join(chatroomId)
  io.to(chatroomId).emit('smsJoin', { chatroomId })
}
export const login = (io, socket) => async () => {
  const chatroomId = socket.userId
  socket.join(chatroomId)
  io.to(chatroomId).emit('joined', { chatroomId })
}
export const missedCall = (io, socket) => async (data) => {
  try {
    const { from, to, type } = await data
    console.log(from, to, type)
    let missed = type === 'accept' ? false : true
    const call = await Call.create({
      status: type,
      to: to,
      from: from,
      missed: missed,
    })
    const user = await User.findById(socket.userId)

    user.calls.push(call)
    await user.save()
  } catch (error) {
    console.log(error)
  }
}
