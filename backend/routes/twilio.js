import { Router } from 'express'
import { auth } from '../middlewares/index.js'
import { twilio } from '../controller/index.js'

const router = Router()

router.route('/').post(auth.loginRequired, twilio.sendText)
router
  .route('/sms')
  .post(twilio.recieveText)
  .get(auth.loginRequired, twilio.getSMS)
router.route('/call').post(twilio.recieveCall)

export default router
