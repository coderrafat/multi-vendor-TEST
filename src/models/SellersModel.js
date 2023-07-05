const { Schema, model } = require('mongoose');


const SellersSchema = new Schema({
    shopName: {
        type: String,
        trim: true,
        required: true,
    },
    shopInfo: {
        type: Object,
        default: {},
        required: true
    },
    payment: {
        type: String
    },
    accountStatus: {
        type: String,
        default: 'pending'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, { timestamps: true, versionKey: false });

const SellerModel = model('sellers', SellersSchema);

module.exports = SellerModel;