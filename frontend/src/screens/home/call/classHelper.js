export class _Call {
  constructor(axios, Device, setOpen, number, setReady, callRef) {
    this.axios = axios
    this.Device = Device
    this.setOpen = setOpen
    this.number = number
    this.setReady = setReady
    this.callRef = callRef
    this.Twilio = new this.Device()
  }
  getToken = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await this.axios.post('/api/twilio/token', config)
      await this.Twilio.setup(data, { enableRingingState: true })
      this.callRef.current = this.Twilio
    } catch (error) {
      console.log(error)
    }
  }
  makeCall = async () => {
    try {
      await this.getToken()
      this.Twilio.on('ready', () => {
        this.setOpen(true)
        this.Twilio.connect({ number: this.number })
        setTimeout(() => this.setReady(true), 5000)
      })
      this.Twilio.on('connect', (data) => {
        console.log('connect', data)
      })
      this.Twilio.on('error', (data) => {
        this.setOpen(false)
        console.log('error', data)
      })
      this.Twilio.on('incoming', (data) => {
        console.log('incomming', data)
      })
      this.Twilio.on('disconnect', (data) => {
        console.log('disconnect', data)
        this.setOpen(false)
      })
      this.Twilio.on('cancel', (data) => {
        console.log('cancel', data)
        this.setOpen(false)
      })
      this.Twilio.on('offline', (data) => {
        console.log('offline', data)
        this.setOpen(false)
      })
    } catch (error) {
      console.log(error)
    }
  }
  disconnect() {
    this.Twilio.disconnectAll()
  }
}
