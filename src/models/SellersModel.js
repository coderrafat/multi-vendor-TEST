const { Schema, model } = require('mongoose');


const SellersSchema = new Schema({
    shopName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    phoneNumber: {
        type: Number,
    },
    shopInfo: {
        type: Object,
        default: {}
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending'
    },
    role: {
        type: String,
        default: 'seller'
    }
}, { timestamps: true, versionKey: false });

const SellerModel = model('sellers', SellersSchema);


module.exports = SellerModel;