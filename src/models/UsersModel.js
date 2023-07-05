const { Schema, model } = require('mongoose');


const UsersSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    address: [{
        country: {
            type: String
        },
        city: {
            type: String
        },
        address1: {
            type: String
        },
        address2: {
            type: String
        },
        zipCode: {
            type: Number
        },
        addressType: {
            type: String,
        }
    }],

    role: {
        type: String,
        default: "customer"
    },
    status: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
    }

}, { timestamps: true, versionKey: false });

const UsersModel = model('users', UsersSchema);

module.exports = UsersModel;