const SendEmail = require("../config/SendEmail");
const { CreateToken } = require("../helpers/CreateToken");
const UsersModel = require("../models/UsersModel");
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken')


//User Register
exports.UserRegister = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        if (!name) {
            return res.json({ massage: 'Name is required' })
        }
        if (!email) {
            return res.json({ massage: 'Email is required' })
        }
        if (!password) {
            return res.json({ massage: 'Password is required' })
        }
        if (!phoneNumber) {
            return res.json({ massage: 'Phone Number is required' })
        }
        if (password.length < 6) {
            return res.json({ massage: 'Password must be at least 6 characters' })
        }

        const existingEmail = await UsersModel.findOne({ email })


        if (existingEmail) {
            return res.json({ massage: 'Email is taken' })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await new UsersModel({ name, email, password: hashedPassword, phoneNumber }).save();

        const token = await CreateToken({ _id: user._id }, '5m');

        const baseURL = 'http://localhost:5000/api/v1'

        //Email Data
        const emailData = {
            to: email,
            subject: 'Account Activition Email',
            html: `<h2>Hello ${name}!</h2>
                    <p>Please Click here to <u><a
                    href="${baseURL}/user/activate/${token}"
                   target="_blank">activate your account</a></u></p>
                   <p>Activation link is expire after in 5 minutes.</p>`
        }

        //Send Email
        SendEmail(emailData);

        res.json({
            status: 'Success',
            massage: `Hello ${name}! Your account has been Created! Please go to your email: ${email} for active your account.`,
            Data: user,
        })

    } catch (error) {
        res.status(200).json({ status: 'fail' })
        console.log(error)
    }
};

//Resend Email Verification
exports.ResendEmailVerify = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UsersModel.findOne({ email });

        if (!user) {
            return res.json({ error: 'User not found' })
        }

        if (user.status === 1) {
            return res.json({ error: 'Your account already activated!' })
        }

        const token = await CreateToken({ _id: user._id }, '5m');

        const baseUrl = 'http://localhost:5000/api/v1'

        //Email Data
        const emailData = {
            to: email,
            subject: 'Account Activition Email',
            html: `<h2>Hello ${user.name}!</h2>
                    <p>Please Click here to <u><a
                    href="${baseUrl}/user/activate/${token}"
                   target="_blank">activate your account</a></u></p>
                   <p>Activation link is expire after in 5 minutes.</p>`
        }

        //Send Email
        await SendEmail(emailData);

        res.json({
            status: 'Success',
            massage: `Please go to your email: ${email} for active your account.`
        })
    } catch (error) {
        console.log(error)
    }
};

//Active User Account
exports.UserActive = async (req, res) => {
    try {
        const token = req.params.token;

        if (!token) {
            return res.json({ error: 'Invalid token' })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await UsersModel.findByIdAndUpdate(decoded, { status: 1 });

        if (user.status === 1) {
            return res.json({ error: 'Invalid Token' })
        }

        res.status(201).json({
            status: 'Success',
            massage: 'Your Account has been activated!'
        })

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.json({ error: 'Token has expired. Please try again' })
        } else if (error.name === 'JsonWebTokenError') {
            return res.json({ error: 'Invalid Token' })
        } else {
            error
        }
        console.log(error)
    }
};

//User Login
exports.UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.json({ error: 'Email is taken' })
        }
        if (!password) {
            return res.json({ error: 'Password is taken' })
        }
        if (password.lenght < 6) {
            return res.json({ error: 'Password must be at least 6 carecters' })
        }

        const user = await UsersModel.findOne({ email });

        if (!user) {
            return res.json({ error: 'User not found' })
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.json({ error: 'Invalid Email or Password' })
        }

        if (user.status !== 1) {
            return res.json({ error: 'Your account is not active.' })
        }

        const token = await CreateToken({ _id: user._id }, '24h');

        res.json({ status: 'Success', massage: 'Login Success', token });

    } catch (error) {
        console.log(error)
    }
};

//User Profile
exports.UserProfile = async (req, res) => {
    try {
        const user = await UsersModel.findById(req.user, 'name email address phoneNumber image role');

        if (!user) {
            return res.json({ error: 'You are not login' })
        }

        res.json(user);

    } catch (error) {
        console.log(error)
    }
};

//Update User Profile
exports.UpdateUserProfile = async (req, res) => {
    try {
        const { name, email, address, phoneNumber } = req.body;

        const existingEmail = await UsersModel.findOne({ email });

        if (existingEmail) {
            return res.json({ error: 'Email is taken' });
        }

        const user = await UsersModel.findById(req.user);

        if (!user) {
            return res.json({ error: 'You are not login. Please first login.' });
        };

        await UsersModel.findByIdAndUpdate(user, {
            name: name || user.name,
            email: email || user.email,
            address: address || user.address,
            phoneNumber: phoneNumber || user.phoneNumber
        });

        res.json({ status: 'Success', massage: 'Your Profile has been Updated!😊' })

    } catch (error) {
        console.log(error)
    }
};

//Update User Profile image
exports.UpdateProfilePic = async (req, res) => {
    try {
        const user = await UsersModel.findById(req.user);

        if (!user) {
            return res.json({ error: 'You are not login. Please first login.' })
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'public/images/users')
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
        }).single('UserProfilePic');

        upload(req, res, async (error) => {
            if (error) {
                res.json({ error: "File Upload Fail" })
            }
            else {
                res.json({ status: 'Success', massage: "File Upload Success" })
                await UsersModel.findByIdAndUpdate(user, { image: req.file.path })
            }
        });

    } catch (error) {
        console.log(error)
    }
};

//Update User Password
exports.UpdateUserPassword = async (req, res) => {
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

        const user = await UsersModel.findById(req.user);

        const checkPassword = await bcrypt.compare(oldPassword, user.password);

        if (!checkPassword) {
            return res.json({ error: 'Password is incorrect. Please try again' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await UsersModel.findByIdAndUpdate(user, { password: hashedPassword })

        //Email Data
        const data = {
            to: user.email,
            subject: 'Update Password',
            html: `<h2>Hello ${user.name}!</h2>
                    <p>Your Password has been Updated!</p>`
        }

        //Send Email
        await SendEmail(data);

        res.json({ status: 'Success', massage: 'Your Password has been Updated!' })

    } catch (error) {
        console.log(error)
    }
};

//Reset Password
exports.SendEmailForResetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UsersModel.findOne({ email });

        if (!user) {
            return res.json({ error: 'User not found' })
        }

        const token = await CreateToken({ _id: user._id }, '5m');

        const baseUrl = 'http://localhost:5000/api/v1'

        //Email Data
        const data = {
            to: email,
            subject: 'Email Verification For Reset Password',
            html: `<h3>Hello ${user.name}</h3>
            <p>Please Click here to <u><a
                    href="${baseUrl}/user/reset-password/${token}"
                   target="_blank">reset your password</a></u></p>
                   <p>Verification link is expire after in 5 minutes.</p>`
        }

        //Send Email
        SendEmail(data);

        res.json({ status: 'Success', massage: `Please go to your email: ${email} for reset password` })
    } catch (error) {
        console.log(error)
    }
};

//Check Token For Email Verification
exports.CheckToken = async (req, res) => {
    try {
        const token = req.params.token;

        if (!token) {
            return res.json({ error: 'Invalid Token' })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await UsersModel.findById(decoded);

        if (!user) {
            return res.json({ error: 'Invalid Token' })
        };

        res.json({ status: 'Success', massage: 'Email Verification Success. Now you can reset password.' })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.json({ error: 'Token has expired. Please try again' })
        } else if (error.name === 'JsonWebTokenError') {
            return res.json({ error: 'Invalid Token' })
        } else {
            error
        }
        console.log(error)
    }
};

//Reset Password After Email Verification
exports.ResetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!newPassword) {
            return res.json({ error: 'New Password is required' })
        }
        if (!confirmPassword) {
            return res.json({ error: 'Confirm Password is required' })
        }
        if (newPassword !== confirmPassword) {
            return res.json({ error: "Password doesn't match" })
        }

        // const user = await UsersModel.findOne({ email });

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await UsersModel.findOneAndUpdate({ email }, { password: hashedPassword });

        //Email Data
        const data = {
            to: email,
            subject: 'Reset Password',
            html: `<p>Your Password Reset Successfull!</p>`
        }

        //Send Email
        SendEmail(data)

        res.json({ status: 'Success', massage: 'Your Password Reset Successful!' })

    } catch (error) {
        console.log(error)
    }
};