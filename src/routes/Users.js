const { UserRegister, ResendEmailVerify, UserLogin, UserProfile, UpdateUserProfile, UpdateProfilePic, UpdateUserPassword, SendEmailForResetPassword, ResetPassword, UserActive, CheckToken } = require('../controllers/Users');
const { isLogin } = require('../middlewares/auth');

const router = require('express').Router();


//User Register Route
router.post('/register', UserRegister);

//Resend Email Verification
router.get('/resend-email-verification', ResendEmailVerify);

//User Active Route
router.get('/user/activate/:token', UserActive);

//User Login
router.get('/login', UserLogin);

//User Profile
router.get('/user/profile', isLogin, UserProfile);

//User Profile Update
router.post('/user/update/profile', isLogin, UpdateUserProfile);

//User Profile Picture Update
router.post('/user/update/profile-pic', isLogin, UpdateProfilePic);

//User Password Update
router.post('/user/update/password', isLogin, UpdateUserPassword);

//Send Verification Email For Reset Password
router.get('/send-email-for-reset-password', SendEmailForResetPassword);

//Check Token For Reset Password Route
router.get('/user/reset-password/:token', CheckToken);

//Reset Password After Email Verification
router.post('/reset-password', ResetPassword)

module.exports = router;