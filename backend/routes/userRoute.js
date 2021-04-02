import { Router } from 'express'
import { user } from '../controller/index.js'
import { auth } from '../middlewares/index.js'

const router = Router()

router
  .route('/')
  .post(auth.loginRequired, user.search)
  .put(auth.loginRequired, user.acceptInvite)

router
  .route('/invite')
  .put(auth.loginRequired, user.addContacts)
  .post(auth.loginRequired, user.userSearch)

router.post('/login', user.login)
router.post('/logout', user.logout)
router.post('/register', user.register)
router.get('/sms', auth.loginRequired, user.getSms)
router.post('/invites', auth.loginRequired, user.sendInvite)
router.post('/uploads/avatar', auth.loginRequired, user.updateAvatar)

router.get('/mobile/:id', auth.loginRequired, user.searchMobileNum)
router
  .route('/:id')
  .get(auth.loginRequired, user.getUserDetails)
  .put(auth.loginRequired, user.updateProfile)
  .delete(auth.loginRequired, user.deleteContactOrGroup)

export default router
