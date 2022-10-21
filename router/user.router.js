const router = require("express").Router()

const UserController = require('../controller/user.controller')
const { 
    checkIfUserExists, 
    checkAccountActivated,
    tokenVerification, 
    signupTokenVerification, 
    loginTokenVerification,
    checkEmailPassword 
} = require('../middleware/auth/verify.middleware')


router.post('/signup', UserController.signupUser)
router.post('/activate/:token', UserController.activateUser)
router.post('/login', checkIfUserExists, UserController.loginUser)
router.post('/forgotPassword', checkIfUserExists, UserController.forgotPassword)
router.post('/resetPassword', checkIfUserExists, UserController.resetPassword)
// router.post('/all', tokenVerification, UserController.findAllUser)
// router.post('/all/:id', tokenVerification, UserController.findOneUser)
// router.put('/update/:id',tokenVerification, UserController.updateUser)
// router.delete('/delete/:id', tokenVerification, UserController.deleteUser)


module.exports = router;
