const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'mongodb://nati:welcome10@ds123399.mlab.com:23399/shop1',
    collection: 'mySessions'
});

app.use(session({
    secret: 'ssshhhh',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    saveUninitialized: true,
    reseave: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/views'));


var sess;
app.get('/', (req, res) => {
    sess = req.session;
    if (sess.email) {
        return res.redirect('/admin');
    };
    res.sendFile('./views/index.html');
})

router.post('/login', (req, res) => {
    sess = req.session;
    sess.email = req.body.email;
    res.end('done');
})

router.get('/admin', (req, res) => {
    sess = req.session;
    if (sess.email) {
        res.write(`<h1>Hello ${sess.email} </h1><br>`);
        res.end(`<a href='/logout'>Logout</a>`);
    } else {
        res.write('<h1>Please login first.</h1>');
        res.end(`<a href='/login'>Login</a>`);
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/')
    })
})

app.use('/', router)
app.listen(3000, err => {
    if (err)
        throw err;
    console.log('listening on port 3000');
})