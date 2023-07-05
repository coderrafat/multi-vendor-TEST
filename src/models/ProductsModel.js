const { Schema, model } = require('mongoose');

const { ObjectId } = Schema;

const ProductsSchema = new Schema({
    sellerId: {
        type: ObjectId,
        ref: "seller",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        max: 64
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: {},
        required: true,
        trim: true,
        max: 2000
    },
    category: {
        type: ObjectId,
        ref: "category",
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    shipping: {
        required: false,
        type: Boolean,
    },
}, { timestamps: true, versionKey: false });

const ProductsModel = model('products', ProductsSchema);

module.exports = ProductsModel;