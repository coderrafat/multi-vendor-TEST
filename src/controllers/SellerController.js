const SendEmail = require("../config/SendEmail");
const SellerModel = require("../models/SellersModel");
const UsersModel = require("../models/UsersModel");

//Create New Shop
exports.CreateShop = async (req, res) => {
    try {
        const user = await UsersModel.findById(req.user);

        const { shopName, shopInfo } = req.body;

        if (!shopName) {
            return res.json({ massage: 'Name is required' })
        }
        if (!shopInfo) {
            return res.json({ massage: 'Email is required' })
        }
        if (user.status === 'seller') {
            return res.json({ error: 'You are already Seller.' })
        }

        const checkSeller = await SellerModel.findOne({ email: user.email });


        if (checkSeller) {


            if (checkSeller.accountStatus === 'pending') {
                return res.json({ error: 'Your Seller account is pending. Please Contact with admin or wait for admin approval. You cannot make multiple requests to create shop with one account.' })
            }
            if (checkSeller.accountStatus === 'active') {
                return res.json({ error: 'Your Selle account is active. You cannot make multiple requests to create shop with one account.' })
            }

            if (checkSeller.accountStatus === 'deactive') {
                return res.json({ error: 'Your Selle account is deactive.Please Contact with admin. You cannot make multiple requests to create shop with one account.' })
            }


        }

        await SellerModel.create({ shopName, shopInfo, email: user.email, phoneNumber: user.phoneNumber, image: user.image });

        //Email Data
        const data = {
            to: user.email,
            subject: 'Create a new Shop Request',
            html: `<h3>Your Request has been sent! Please wait for admin approval.</h3>`
        }

        //Send Email
        SendEmail(data);

        res.status(201).json({
            status: 'Successs',
            massage: 'Your request has been sent! Please wait for admin approval',
        });

    } catch (error) {
        res.status(200).json({ status: 'fail' })
        console.log(error)
    }
};

//Seller Profile
exports.SellerProfile = async (req, res) => {
    try {
        const user = await UsersModel.findById(req.user);

        if (!user) {
            return res.json({ error: 'You are not login. Please first login.' })
        }

        await SellerModel.findOne({ email: user.email }, 'shopName email image shopInfo phoneNumber');

        res.json(user)

    } catch (error) {
        console.log(error)
    }
};

//Update Seller Profile
exports.UpdateSellerProfile = async (req, res) => {
    try {
        const { shopName, email, phoneNumber, shopInfo, } = req.body;

        const existingEmail = await SellerModel.findOne({ email });

        if (existingEmail) {
            return res.json({ error: 'Email is taken' })
        }

        const user = await UsersModel.findById(req.user);

        await SellerModel.findOneAndUpdate({ email: user.email }, {
            shopName: shopName || user.shopName,
            email: email || user.email,
            phoneNumber: phoneNumber || user.phoneNumber,
            shopInfo: shopInfo || user.shopInfo
        }, { new: true });

        res.json({ status: 'Success', massage: 'Seller Profile has been Updated!😊' })

    } catch (error) {
        console.log(error)
    }
};

