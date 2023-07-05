const mongoose = require('mongoose');
require('dotenv').config('./config.env');

//Database Connect
const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Database has been Connected!😊')
    } catch (error) {
        console.log('Database has been not Connected!😒', error)
    }
}
module.exports = ConnectDB;