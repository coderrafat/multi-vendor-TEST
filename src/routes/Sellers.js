const { ResetPassword, UpdateSellerPassword, UpdateProfilePic, UpdateSellerProfile, SellerProfile, CreateShop } = require('../controllers/SellerController');
const { isLogin, isSeller } = require('../middlewares/auth');

const router = require('express').Router();

//Create New Shop Route
router.post('/create-shop', isLogin, CreateShop);

//Seller Profile Route
router.get('/seller/profile', isLogin, SellerProfile);

//Update Seller Profile Route
router.post('/seller/profile/update', isLogin, UpdateSellerProfile);



module.exports = router;