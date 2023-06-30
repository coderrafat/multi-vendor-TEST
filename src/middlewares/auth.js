const jwt = require('jsonwebtoken');
const AdminModel = require('../models/AdminModel');

//Check Login Middleware
exports.isLogin = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ error: 'You are not login. Please login first.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'You are not login. Please login first.' })
        console.log(error)
    }
};

//Check Admin Middleware
exports.isAdmin = async (req, res, next) => {
    try {
        const user = await AdminModel.findById(req.user);

        if (user.role !== 'admin') {
            return res.json({ error: 'You are not Admin' })
        }

        next();
    } catch (error) {
        console.log(error)
    }
};
