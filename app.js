//Basic import
const { readdirSync } = require('fs')
const express = require('express');
const app = express();


//Security middlewares import
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');


//Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });


//Security middlewares implement
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());
app.use(limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.json());


//Route
readdirSync("./src/routes").map(r => app.use("/api/v1", require(`./src/routes/${r}`)));


//Undefined Route
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' })
})


module.exports = app;