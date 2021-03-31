export const smsJoin = (io, socket) => async ({ chatroomId }) => {
  socket.join(chatroomId)
  io.to(chatroomId).emit('smsJoin', { chatroomId })
}
export const login = (io, socket) => async () => {
  const chatroomId = socket.userId
  socket.join(chatroomId)
  io.to(chatroomId).emit('joined', { chatroomId })
}
