const { AdminLogin, AdminProfile, UpdateAdminProfile, UpdateAdminPassword, ResetPassword, UpdateProfilePic, ApprovedSeller, PendingSeller, SellerRequestApprove } = require('../controllers/AdminController');
const { SendOTP, VerifyOTP } = require('../helpers/OTP');
const { isLogin, isAdmin } = require('../middlewares/auth');

const router = require('express').Router();



//Admin Login Route
router.get('/admin-login', AdminLogin);

//Admin Profile Route
router.get('/admin-profile', isLogin, AdminProfile);

//Update Admin Profile Route
router.put('/admin/profile/update', isLogin, UpdateAdminProfile);

//Update Admin Profile Picture Route
router.post('/admin/update/profile-pic', isLogin, UpdateProfilePic);

//Update Admin Password Route
router.patch('/admin/update-password', isLogin, UpdateAdminPassword);

//Reset Password Route
router.patch('/admin/reset-password', ResetPassword);



//Send OTP For Email Verification Route
router.post('/send-otp', SendOTP);

//Verify OTP For Email Verification Route
router.get('/verify-otp', VerifyOTP);


//Seller Request Approve Route
router.put('/seller-request-approve/:sellerId', isLogin, isAdmin, SellerRequestApprove);


//All Approved Seller Route
router.get('/approved-sellers', isLogin, isAdmin, ApprovedSeller);

//All Pending Seller Route
router.get('/pending-sellers', isLogin, isAdmin, PendingSeller);





module.exports = router;