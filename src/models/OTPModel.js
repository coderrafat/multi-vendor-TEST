const { Schema, model } = require('mongoose');

const OTPSchema = new Schema({

    email: { type: String },
    otp: { type: Number },
    status: { type: Number, default: 0 },
    createAt: {
        type: Date,
        expires: '5m',
        default: new Date()
    }

}, { timestamps: true, versionKey: false })

const OTPModel = model('otps', OTPSchema);

module.exports = OTPModel;