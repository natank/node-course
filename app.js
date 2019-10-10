/**External modules */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;
const MONGODB_URI = require('./util/database').dbURI;

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
/**App controll*/
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const csrfProtection = csrf();

const errorController = require('./controllers/error');
/**Models */
const User = require('./models/user')
/**Routes */
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

setMiddleware();
connect();

function setMiddleware() {
  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(express.static(path.join(__dirname, 'public')));

  //Define session middleware
  app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  }))
  app.use(csrfProtection);
  app.use(flash());

  app.use(async (req, res, next) => {
    if (req.session.user) {
      try {
        let user = await User.findById(req.session.user._id)

        if (user) {
          req.user = user;
        }
      } catch (err) {
        throw new Error(err)
      }
    }
    next()
  })


  app.use(async (req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  })

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes)

  app.get('/500', errorController.get500)
  app.use(errorController.get404);

  // Error handling middleware
  app.use((error, req, res, next) => {
    res.redirect('/500')
  })
}

async function connect() {
  try {
    await mongoConnect()
    app.listen(3000);
  } catch (err) {
    console.log(err)
  }

}