export class Message {
  constructor(data, userInfo) {
    this.message = data.message
    this.name = data.name
    this.image = data.image
    this.chatroomId = data.chatroomId
    this.userId = data.userId
    this.myUserId = userInfo._id
  }
  myMessage = () => {
    return this.userId === this.myUserId
  }
}

export class OldMessage {
  constructor(message, userInfo) {
    this.message = message.message
    this.name = message.user.name
    this.image = message.user.image
    this.userId = message.user._id
    this.myUserId = userInfo._id
  }
  myMessage = () => {
    return this.userId === this.myUserId
  }
}

export class SendMessage {
  constructor(message, chatroomId, userInfo, socket, type) {
    this.message = message
    this.name = userInfo.name
    this.image = userInfo.image
    this.chatroomId = chatroomId
    this.userId = userInfo._id
    this.socket = socket
    this.type = type
  }

  send = () => {
    this.socket.emit('messageInput', {
      message: this.message,
      name: this.name,
      image: this.image,
      chatroomId: this.chatroomId,
      userId: this.userId,
      type: this.type,
    })
  }
}
