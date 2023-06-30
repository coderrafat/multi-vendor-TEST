const SendEmail = require("../config/SendEmail");
const { CreateToken } = require("../helpers/CreateToken");
const SellerModel = require("../models/SellersModel");
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');


//Seller Register
exports.SellerRegister = async (req, res) => {
    try {
        const { shopName, email, password } = req.body;

        if (!shopName) {
            return res.json({ massage: 'Name is required' })
        }
        if (!email) {
            return res.json({ massage: 'Email is required' })
        }
        if (!password) {
            return res.json({ massage: 'Password is required' })
        }
        if (password.length < 6) {
            return res.json({ massage: 'Password must be at least 6 characters' })
        }

        const existingEmail = await SellerModel.findOne({ email })

        if (existingEmail) {
            return res.json({ massage: 'Email is taken' })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const seller = await SellerModel.create({ shopName, email, password: hashedPassword, });

        const token = await CreateToken({ _id: seller._id })

        res.status(201).json({
            status: 'Successs',
            massage: `Hello Seller! Your account has been Created!`,
            Data: seller,
            token
        });

    } catch (error) {
        res.status(200).json({ status: 'fail' })
        console.log(error)
    }
};

//Seller Login
exports.SellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.json({ error: 'Email is required' })
        }
        if (!password) {
            return res.json({ error: 'Password is required' })
        }

        const user = await SellerModel.findOne({ email });

        if (!user) {
            return res.json({ error: 'User not found' })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.json({ error: 'Invalid Email or Password' })
        }

        const token = await CreateToken({ _id: user._id })

        res.status(200).json({
            status: 'Success',
            massage: "Seller Login Success!",
            token
        })

    } catch (error) {
        console.log(error)
    }
};

//Seller Profile
exports.SellerProfile = async (req, res) => {
    try {

        const user = await SellerModel.findById(req.user, 'shopName email image shopInfo phoneNumber');

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

        const user = await SellerModel.findById(req.user);

        await SellerModel.findByIdAndUpdate(user, {
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

//Update Seller Profile Picture
exports.UpdateProfilePic = async (req, res) => {
    try {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads')
            },
            filename: (req, file, cb) => {
                const fileExt = path.extname(file.originalname);
                const fileName = file.originalname
                    .replace(fileExt, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") + "-" + Date.now()

                cb(null, fileName + fileExt)
            }
        })

        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 5000000  //5MB
            },
        }).single('SellerProfilePic');

        upload(req, res, async (error) => {
            if (error) {
                res.json({ error: "File Upload Fail" })
            }
            else {
                res.json({ status: 'Success', massage: "File Upload Success" })
                await SellerModel.findByIdAndUpdate(req.user, { image: req.file.path })
            }
        });


    } catch (error) {
        console.log(error)
    }
};

//Update Seller Password
exports.UpdateSellerPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword) {
            return res.json({ error: 'Old Password is required' })
        }
        if (!newPassword) {
            return res.json({ error: 'New Password is required' })
        }
        if (newPassword.lenght < 6) {
            return res.json({ error: 'New Password at least 6 character' })
        }

        const user = await SellerModel.findById(req.user);

        const checkPassword = await bcrypt.compare(oldPassword, user.password);

        if (!checkPassword) {
            return res.json({ error: 'Password is incorrect. Please try again' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await SellerModel.findByIdAndUpdate(user, { password: hashedPassword })


        //Send Email
        const data = {
            to: email,
            subject: 'Password Reset',
            html: `<h2>Hello Seller! Your Password has been Updated!</h2>`
        }
        SendEmail(data)

        res.json({ status: 'Success', massage: 'Your Password has been Updated!' })

    } catch (error) {
        console.log(error)
    }
};

//Reset Password
exports.ResetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await AdminModel.findOne({ email });

        if (!user) {
            return res.json({ error: 'User not found' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await SellerModel.findOneAndUpdate(user, { password: hashedPassword });


        //Send Email
        const data = {
            to: email,
            subject: 'Password Reset',
            html: `<h2>Hello ${user.name}! Your Password Reset Successfully</h2>`
        }
        SendEmail(data)


        res.json({ status: 'Success', massage: 'Your password has been Reset Successfully' })

    } catch (error) {
        console.log(error)
    }
};