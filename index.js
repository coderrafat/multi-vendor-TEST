const app = require('./app');
const connectDB = require('./src/config/connectDB');
require('dotenv').config();
const port = process.env.PORT || 6000;


app.listen(port, async () => {
    console.log(`Server Running Port ${port}`)
    await connectDB()
})