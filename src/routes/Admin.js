const { SellerActive, SellerDeactive, ActiveSellers, DeactiveSellers, PendingSellers } = require('../controllers/AdminController');
const { isLogin, isAdmin } = require('../middlewares/auth');

const router = require('express').Router();


//Seller Active Route
router.post('/seller/active/:sellerId', isLogin, isAdmin, SellerActive);

//Seller Deactive Route
router.post('/seller/deactive/:sellerId', isLogin, isAdmin, SellerDeactive);

//All Active Seller Route
router.get('/sellers/active', isLogin, isAdmin, ActiveSellers);

//All Deactive Seller Route
router.get('/sellers/deactive', isLogin, isAdmin, DeactiveSellers);

//All Pending Seller Route
router.get('/sellers/pending', isLogin, isAdmin, PendingSellers);





module.exports = router;