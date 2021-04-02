import { Router } from 'express'
import { chatroom } from '../controller/index.js'
import { auth } from '../middlewares/index.js'

const router = Router()

router.post('/private', auth.loginRequired, chatroom.createPrivateRoom)

router.get('/private/:id', auth.loginRequired, chatroom.getPrivateMessages)

// public routes

router.post('/', auth.loginRequired, chatroom.createPublicRoom)
router.get('/:id', auth.loginRequired, chatroom.getPublicMessages)

export default router
