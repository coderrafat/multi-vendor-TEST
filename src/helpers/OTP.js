const SendEmail = require("../config/SendEmail");
const AdminModel = require("../models/AdminModel");
const OTPModel = require("../models/OTPModel");

//Send OTP For Email Verification
exports.SendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ massage: 'email is required' })
        }

        const existingUser = await AdminModel.findOne({ email });

        if (!existingUser) {
            return res.json({ massage: 'User not found' })
        }

        //Create OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        await OTPModel.create({ email, otp });

        //Create Email Data
        const emailData = {
            to: email,
            subject: 'Email Verification',
            html: `<h2>Your Verification Code is: ${otp}</h2>
                    <h5>Code is Expire after in 5 minutes</h5>`
        }

        //Email Send
        SendEmail(emailData);

        res.json({ status: 'Success', massage: `Email Sent Success for Email Verification. Please check your email: ${email}` })
    } catch (error) {
        console.log(error)
    }
};

//Verify OTP For Email Verification
exports.VerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const userOtp = await OTPModel.findOne({ email, otp });
        const expireOtp = new Date() - userOtp.createdAt;

        const seconds = Math.floor(expireOtp / 1000);

        if (seconds > 300) {
            return res.json({ error: 'Code is expired! Please try again.' })
        }
        if (userOtp.status === 1) {
            return res.json({ error: 'Code is Already Used' })
        }

        await OTPModel.updateOne(userOtp, { status: 1 })

        res.json({ massage: 'Email Verification Success!' })
    } catch (error) {
        res.json({ error: 'Invalid Code' })
    }
};