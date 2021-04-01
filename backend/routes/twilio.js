import { Router } from 'express'
import { auth } from '../middlewares/index.js'
import { twilio } from '../controller/index.js'

const router = Router()

router.route('/').post(auth.loginRequired, twilio.sendText)

router
  .route('/sms')
  .post(twilio.recieveText)
  .put(auth.loginRequired, twilio.setToRead)

router.route('/call').get(twilio.recieveCall).post(twilio.makeCall)

router.route('/answerCall').post(twilio.answerCall)
router.route('/token').post(twilio.getToken)

export default router
