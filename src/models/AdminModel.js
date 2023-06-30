const { Schema, model } = require('mongoose');


const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    phoneNumber: {
        type: String,
        required: true
    },
    image: {
        type: String,

    },
    role: {
        type: String,
        default: "admin"
    }
}, { timestamps: true, versionKey: false });

const AdminModel = model('admins', adminSchema);

module.exports = AdminModel;