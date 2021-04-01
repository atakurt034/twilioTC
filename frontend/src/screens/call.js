import React from 'react'

import axios from 'axios'
import { Device } from 'twilio-client'

export const Call = () => {
  React.useEffect(() => {
    const getToken = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }

        const { data } = await axios.post('/api/twilio/token', config)
        const Twilio = new Device()
        Twilio.setup(data)
        Twilio.ready(() => {
          console.log('Connected')
          Twilio.connect({ number: '+639614203904' })
        })

        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    getToken()
  }, [])

  return <div></div>
}
