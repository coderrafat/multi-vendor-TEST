const AdminModel = require("../models/AdminModel");
const bcrypt = require('bcrypt');
const { CreateToken } = require("../helpers/CreateToken");
const SendEmail = require("../config/SendEmail");
const multer = require('multer')
const path = require('path');
const SellerModel = require("../models/SellersModel");


//Admin Login
exports.AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.json({ error: 'Email is required' })
        }
        if (!password) {
            return res.json({ error: 'Password is required' })
        }

        const user = await AdminModel.findOne({ email });

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
            massage: "Admin Login Success!",
            token
        })

    } catch (error) {
        console.log(error)
    }
};

//Admin Profile
exports.AdminProfile = async (req, res) => {
    try {

        const user = await AdminModel.findById(req.user, 'name email image');

        res.json({ Data: user })

    } catch (error) {
        console.log(error)
    }
};

//Update Admin Profile
exports.UpdateAdminProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const existingEmail = await AdminModel.findOne({ email });

        if (existingEmail) {
            return res.json({ error: 'Email is taken' })
        }

        const user = await AdminModel.findById(req.user);

        const updateProfile = await AdminModel.findByIdAndUpdate(user, {
            name: name || user.name,
            email: email || user.email
        });

        res.json({ status: 'Success', massage: 'Admin Profile has been Updated!😊' })

    } catch (error) {
        console.log(error)
    }
};

//Update Admin Profile Picture
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
        }).single('AdminProfilePic');


        upload(req, res, async (error) => {
            if (error) {
                res.json({ error: "File Upload Fail" })
            }
            else {
                res.json({ status: 'Success', massage: "File Upload Success" })
                await AdminModel.findByIdAndUpdate(req.user, { image: req.file.path })
            }
        });


    } catch (error) {
        console.log(error)
    }
};

//Update Admin Password
exports.UpdateAdminPassword = async (req, res) => {
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

        const user = await AdminModel.findById(req.user);

        const checkPassword = await bcrypt.compare(oldPassword, user.password);

        if (!checkPassword) {
            return res.json({ error: 'Password is incorrect. Please try again' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await AdminModel.findByIdAndUpdate(user, { password: hashedPassword })

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

        await AdminModel.findOneAndUpdate(user, { password: hashedPassword });


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


//All Approved Seller
exports.ApprovedSeller = async (req, res) => {
    try {
        const seller = await SellerModel.find({ status: 'approved' });

        res.json(seller);
    } catch (error) {
        console.log(error)
    }
};

//All Pending Seller
exports.PendingSeller = async (req, res) => {
    try {
        const seller = await SellerModel.find({ status: 'pending' });

        res.json(seller);
    } catch (error) {
        console.log(error)
    }
};

//Seller Request Approve
exports.SellerRequestApprove = async (req, res) => {
    try {
        const seller = await SellerModel.findByIdAndUpdate(req.params.sellerId, { status: 'approved' })

        if (!seller) {
            return res.json({ error: 'Seller not found' })
        }

        res.json({ status: 'Success' })
    } catch (error) {
        console.log(error)
    }
}




