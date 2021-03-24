export class Message {
  constructor(data) {
    this.message = data.message
    this.name = data.name
    this.image = data.image
    this.chatroomId = data.chatroomId
    this.userId = data.userId
  }
  myMessage(userInfo) {
    return this.userId === userInfo._id
  }
}

export class OldMessage {
  constructor(message, id) {
    this.message = message.message
    this.name = message.user.name
    this.image = message.user.image
    this.chatroomId = id._id
    this.userId = message.user._id
  }
  myMessage(userInfo) {
    return this.userId === userInfo._id
  }
}
