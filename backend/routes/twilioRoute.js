import { Router } from 'express'
import { auth } from '../middlewares/index.js'
import { twilio } from '../controller/index.js'

const router = Router()

router.route('/').post(auth.loginRequired, twilio.sendText)

router
  .route('/sms')
  .post(twilio.recieveText)
  .put(auth.loginRequired, twilio.setToRead)

router.route('/call').post(twilio.makeCall).get(twilio.makeCall)
router.route('/call/incoming').post(twilio.recieveCall).get(twilio.recieveCall)

router.route('/callback').post(twilio.callback)
router.route('/token').post(twilio.getTokenCall)

router.route('/sms/history').get(auth.loginRequired, twilio.getSmsHistory)
router.route('/call/history').get(auth.loginRequired, twilio.getCallHistory)

export default router
