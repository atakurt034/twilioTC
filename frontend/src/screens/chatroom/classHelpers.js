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

export class GetPermission {
  streams = {}
  constructor(myMicFeed, myVideoFeed, myVideoRef, setStream) {
    this.navigator = navigator.mediaDevices
    this.myMicFeed = myMicFeed
    this.myVideoFeed = myVideoFeed
    this.myVideoRef = myVideoRef
    this.setStream = setStream
  }
  getStreams = async () => {
    const stream = await this.navigator.getUserMedia({
      video: true,
      audio: true,
    })

    this.streams = stream
    if (this.setStream) {
      this.setStream(stream)
    }
    if (this.myVideoRef.current) {
      this.myVideoRef.current.srcObject = stream
    }
    this.myVideoFeed.current = stream.getVideoTracks()[0]
    this.myMicFeed.current = stream.getAudioTracks()[0]
    return this.streams
  }

  closeStreams = () => {
    navigator.mediaDevices &&
      this.streams &&
      this.streams.getTracks().forEach((track) => track.stop())
  }
}
