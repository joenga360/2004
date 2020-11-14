const router = require('express-promise-router')()
const authController = require('../controllers/auth')
const authenticate = require("../helpers/authenticate")

router.route('/').post(authController.addUser)
router.route('/signin').post(authController.signInUser)
router.route('/signout').get(authenticate.isAdmin, authController.userLogOut)

module.exports = router