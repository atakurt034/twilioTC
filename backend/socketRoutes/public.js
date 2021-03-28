const users = {}
const socketToRoom = {}

export const joinRoom = (io, socket) => async ({ roomID, name }) => {
  socket.join(roomID)
  if (users[roomID]) {
    const length = users[roomID].length
    if (length === 4) {
      socket.emit('room full')
      return
    }
    users[roomID].push(socket.id)
  } else {
    users[roomID] = [socket.id]
  }
  socketToRoom[socket.id] = roomID
  const usersInThisRoom = users[roomID].filter((id) => id !== socket.id)

  socket.emit('all users', { id: usersInThisRoom })
}

export const sendingSignal = (io, socket) => async (payload) => {
  io.to(payload.userToSignal).emit('user joined', {
    signal: payload.signal,
    callerID: payload.callerID,
  })
}

export const returningSignal = (io, socket) => async (payload) => {
  io.to(payload.callerID).emit('receiving returned signal', {
    signal: payload.signal,
    id: socket.id,
  })
}
export const disconnect = (io, socket) => async ({ chatroomId }) => {
  const roomID = socketToRoom[socket.id]
  let room = users[roomID]
  if (room) {
    room = room.filter((id) => id !== socket.id)
    users[roomID] = room
  }
  io.to(chatroomId).emit('left', socket.id)
}
