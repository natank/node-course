/**External modules */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerCfg = require('./middleware/multerCfg');
const mongoConnect = require('./util/database').mongoConnect;
const MONGODB_URI = require('./util/database').dbURI;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./controllers/error');
const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

/** global app variables */
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();


/**Middleware */

const dataMW = (function (app) {
  app.use(
    multer({
      storage: multerCfg.fileStorage,
      fileFilter: multerCfg.fileFilter
    }).single('image')
  );
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(
    bodyParser.json()
  )
})(app)

const sessionMW = (function (app) {
  //Define session middleware
  app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
})(app)

const generalMW = (function (app) {
  app.set('view engine', 'ejs');
  app.set('views', 'views');
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use(flash());
})(app)

const csrfMW = (function (app) {
  app.use(csrfProtection);
})(app)

const userMW = (function (app) {
  app.use(async (req, res, next) => {
    if (req.session.user) {
      try {
        let user = await User.findById(req.session.user._id);

        if (user) {
          req.user = user;
        }
      } catch (err) {
        throw new Error(err);
      }
    }
    next();
  });
})(app)

const finalMW = (function (app) {
  app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes);

  app.get('/500', errorController.get500);
  app.use(errorController.get404);

  // Error handling middleware
  app.use((error, req, res, next) => {
    console.log(error);
    res.redirect('/500');
  });
})(app);

const connect = (async function (app) {
  try {
    await mongoConnect();
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
})(app)