let users = {}

export const privateJoin = (io, socket) => async ({ chatroomId, user }) => {
  users[socket.userId] = chatroomId
  socket.join(chatroomId)
  io.to(chatroomId).emit('privateJoined', { chatroomId, user })
}

export const privateCall = (io, socket) => async ({
  signal,
  chatroomId,
  caller,
}) => {
  users[socket.userId] = chatroomId

  io.to(chatroomId).emit('privateCalling', {
    signal,
    chatroomId,
    caller,
  })
}

export const privateCallAnswer = (io, socket) => async ({
  signal,
  chatroomId,
}) => {
  io.to(chatroomId).emit('privateCallAnswered', {
    signal,
  })
}

export const privateCancelCall = (io, socket) => async ({ chatroomId }) => {
  io.to(chatroomId).emit('privateCallCancelled', {
    chatroomId,
  })
}
export const callEnd = (io, socket) => async ({ chatroomId, id }) => {
  io.to(chatroomId).emit('callEnded')
}
export const shareScreen = (io, socket) => async ({ chatroomId, streams }) => {
  io.to(chatroomId).emit('sharingSreen', { streams })
}

export const disconnect = (io, socket) => async () => {
  const roomId = users[socket.userId]
  io.to(roomId).emit('callEnded')
  delete users[socket.userId]
}
