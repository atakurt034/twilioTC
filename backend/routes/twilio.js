import { Router } from 'express'
import { auth } from '../middlewares/index.js'
import { twilio } from '../controller/index.js'

const router = Router()

router.route('/').post(auth.loginRequired, twilio.sendText)

export default router
