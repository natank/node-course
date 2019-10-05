/**External modules */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;
const MONGODB_URI = require('./util/database').dbURI;

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

/**App controll*/
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const errorController = require('./controllers/error');
/**Models */
// const User = require('./models/user').User
/**Routes */
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

setMiddleware();
connect();
//createUser()

function createUser() {
  User.create({
    name: "alon",
    email: "along@gmail.com",
    cart: [],
    orders: []
  })
}

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



  app.use('/admin', adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes)

  app.use(errorController.get404);
}

async function connect() {
  try {
    await mongoConnect()
    app.listen(3000);
  } catch (err) {
    console.log(err)
  }

}