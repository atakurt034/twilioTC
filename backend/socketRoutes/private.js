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
  io.to(chatroomId).emit('privateOutput', { message, name, image, chatroomId })
}
