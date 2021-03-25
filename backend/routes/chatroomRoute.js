import { Router } from 'express'
import { chatroom } from '../controller/index.js'
import { auth } from '../middlewares/index.js'

const router = Router()

router.route('/private').post(auth.loginRequired, chatroom.createPrivateRoom)

router
  .route('/private/:id')
  .get(auth.loginRequired, chatroom.getPrivateMessages)

// public routes

router.route('/').post(auth.loginRequired, chatroom.createPublicRoom)
router.route('/:id').get(auth.loginRequired, chatroom.getPublicMessages)

export default router
