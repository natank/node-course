const path = require('path');
const express = require('express');
const mongoConnect = require('./util/database').mongoConnect;
const MONGODB_URI = require('./util/database').dbURI;

const bodyParser = require('body-parser');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const multerCfg = require('./middleware/multerCfg');

app.use(bodyParser.json()); // application/json

app.use(
    multer({
        storage: multerCfg.fileStorage,
        fileFilter: multerCfg.fileFilter
    }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


const connect = (async function (app) {
    try {
        await mongoConnect();
        app.listen(8080);
    } catch (err) {
        console.log(err);
    }
})(app)

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message
    });
})