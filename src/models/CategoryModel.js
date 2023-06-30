const { Schema, model } = require('mongoose');


const CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    }
}, { timestamps: true, versionKey: false });

const CategoryModel = model('categories', CategorySchema);


module.exports = CategoryModel;