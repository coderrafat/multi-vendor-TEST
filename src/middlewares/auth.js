const jwt = require('jsonwebtoken');
const AdminModel = require('../models/AdminModel');
const UsersModel = require('../models/UsersModel');
const SellerModel = require('../models/SellersModel');

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
    }
};

//Check Admin Middleware
exports.isAdmin = async (req, res, next) => {
    try {
        const user = await UsersModel.findById(req.user);

        if (!user) {
            return res.json({ error: 'You are not login. Please first login.' })
        }

        if (user.role !== 'admin') {
            return res.json({ error: 'You are not Admin' })
        }

        next();
    } catch (error) {
        console.log(error)
    }
};

//Check Seller Middleware
exports.isSeller = async (req, res, next) => {
    try {
        const user = await UsersModel.findById(req.user);

        if (!user) {
            return res.json({ error: 'You are not login' })
        }

        if (user.role !== 'seller') {
            return res.json({ error: 'You are not Seller. Only seller can controll product' })
        }


        next();

    } catch (error) {
        console.log(error)
    }
};

//Check Pending Seller Middleware
exports.isPendingSeller = async (req, res, next) => {
    try {
        const seller = await SellerModel.findById(req.user);

        if (seller.accountStatus === 'pending') {
            return res.json({ error: 'Your account is pending. Please contact with admin or wait for admin approval.' })
        }

        next();
    } catch (error) {
        console.log(error)
    }
};

//Check Deactive Seller Middleware
exports.isDeactiveSeller = async (req, res, next) => {
    try {
        const seller = await SellerModel.findById(req.user);

        if (seller.accountStatus === 'deactive') {
            return res.json({ error: 'Your Account is Deactive. Please contact with admin for active your account.' })
        }

        next();
    } catch (error) {
        console.log(error)
    }
};

