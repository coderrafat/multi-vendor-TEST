const { Schema, model } = require('mongoose');

const OTPSchema = new Schema({

    email: { type: String },
    otp: { type: Number },
    status: { type: Number, default: 0 },


}, { timestamps: true, versionKey: false })

const OTPModel = model('otps', OTPSchema);

module.exports = OTPModel;