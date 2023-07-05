const { ProductCreate, UpdateProduct, ReadProduct, DeleteProduct } = require('../controllers/ProductsController');
const { isLogin, isSeller, isPendingSeller, isDeactiveSeller } = require('../middlewares/auth');

const router = require('express').Router();


//Create New Product Route
router.post('/product/create', isLogin, isSeller, isPendingSeller, isDeactiveSeller, ProductCreate);

//Update Product Route
router.post('/product/update/:productId', isLogin, isSeller, isPendingSeller, isDeactiveSeller, UpdateProduct);

//Read Product Route
router.get('/product/:productId', isLogin, isSeller, isPendingSeller, isDeactiveSeller, ReadProduct);

//Delete Product Route
router.delete('/product/delete/:productId', isLogin, isSeller, isPendingSeller, isDeactiveSeller, DeleteProduct);



module.exports = router;