export const privateJoin = (io, socket) => async ({ chatroomId }) => {
  socket.join(chatroomId)
  io.to(chatroomId).emit('privateJoin', { userId: socket.userId })
}

export const privateInput = (io, socket) => async ({
  message,
  name,
  image,
  chatroomId,
}) => {
  io.to(chatroomId).emit('privateOutput', {
    message,
    name,
    image,
    chatroomId,
    userId: socket.userId,
  })
}

export const privateCall = (io, socket) => async ({
  chatroomId,
  signal,
  caller,
}) => {
  io.to(chatroomId).emit('privateCalling', {
    chatroomId,
    signal,
    caller,
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
