const { AdminLogin } = require('../controllers/AdminController');

const express = require('express')
const router = express.Router();


router.get('/register', AdminLogin);

module.exports = router