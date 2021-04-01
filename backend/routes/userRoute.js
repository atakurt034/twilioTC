import { Router } from 'express'
import { user } from '../controller/index.js'
import { auth } from '../middlewares/index.js'

const router = Router()

router
  .route('/:id')
  .get(auth.loginRequired, user.getUserDetails)
  .post(auth.loginRequired, user.updateProfile)
  .delete(auth.loginRequired, user.deleteContactOrGroup)

router.route('/uploads/avatar').post(auth.loginRequired, user.updateAvatar)

router.put('/login', user.login)
router.post('/logout', user.logout)
router.route('/register').put(user.register)

router
  .route('/')
  .post(auth.loginRequired, user.search)
  .put(auth.loginRequired, user.acceptInvite)

router.route('/mobile/:id').get(auth.loginRequired, user.searchMobileNum)

router
  .route('/invite')
  .put(auth.loginRequired, user.addContacts)
  .post(auth.loginRequired, user.userSearch)

router.route('/sms').get(auth.loginRequired, user.getSms)

router.route('/invites').post(auth.loginRequired, user.sendInvite)

export default router
