const { ResetPassword, UpdateSellerPassword, UpdateProfilePic, UpdateSellerProfile, SellerProfile, SellerLogin, SellerRegister } = require('../controllers/SellerController');
const { isLogin } = require('../middlewares/auth');

const router = require('express').Router();

//Seller Register Route
router.post('/seller/register', SellerRegister);

//Seller Login Route
router.get('/seller/login', SellerLogin);

//Seller Profile Route
router.get('/seller/profile', isLogin, SellerProfile);

//Update Seller Profile Route
router.put('/seller/profile/update', isLogin, UpdateSellerProfile);

//Update Seller Profile Picture Route
router.post('/seller/update/profile-pic', isLogin, UpdateProfilePic);

//Update Seller Password Route
router.patch('/seller/update-password', isLogin, UpdateSellerPassword);

//Reset Password Route
router.patch('/seller/reset-password', ResetPassword);


module.exports = router;