import { Router } from 'express'
import { user } from '../controller/index.js'
import { auth } from '../middlewares/index.js'

const router = Router()

router.route('/:id').get(auth.loginRequired, user.getUserDetails)

router.post('/register', user.register)
router.post('/login', user.login)

router
  .route('/')
  .post(auth.loginRequired, user.search)
  .put(auth.loginRequired, user.acceptInvite)

router.route('/invite').put(auth.loginRequired, user.addContacts)

export default router
