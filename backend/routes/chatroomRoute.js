import { Router } from 'express'
import { chatroom } from '../controller/index.js'
import { auth } from '../middlewares/index.js'

const router = Router()

router.route('/private').post(auth.loginRequired, chatroom.createPrivateRoom)

export default router
