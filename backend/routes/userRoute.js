import { Router } from 'express'
import { user } from '../controller/index.js'
import { auth } from '../middlewares/index.js'

const router = Router()

router
  .route('/:id')
  .get(auth.loginRequired, user.getUserDetails)
  .put(auth.loginRequired, user.addContacts)

router.post('/register', user.register)
router.post('/login', user.login)

router.route('/').get(auth.loginRequired, user.search)

export default router
