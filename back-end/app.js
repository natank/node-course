const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const s3 = require('./utils/aws-s3');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json()); // application/json
app.use(s3.uploadFile)
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
})



mongoose.connect(process.env.mongodbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(result => {
    app.listen(8080);
})
