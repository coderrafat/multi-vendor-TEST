const { CreateCategory, UpdateCategory, ReadCategory, DeleteCategory, ListCategory } = require('../controllers/CategoryController');
const { isLogin, isAdmin } = require('../middlewares/auth');

const router = require('express').Router();


//Create New Category Route
router.post('/category/create', CreateCategory);

//Update Category Route
router.patch('/category/update/:categoryId', isLogin, isAdmin, UpdateCategory);

//Read Category Route
router.get('/category/read/:slug', isLogin, isAdmin, ReadCategory);

//Delete Category Route
router.delete('/category/delete/:categoryId', isLogin, isAdmin, DeleteCategory);

//List Category Route
router.get('/category/list', isLogin, isAdmin, ListCategory);

module.exports = router;