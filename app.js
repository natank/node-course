/**External modules */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;

/**App controll*/
const app = express();
const errorController = require('./controllers/error');
/**Models */
const User = require('./models/user')
/**Routes */
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


setMiddleware();
connect();
// createUser()

function createUser() {
  User.create({
    name: "alon",
    email: "along@gmail.com",
    cart: []
  })
}

function setMiddleware() {
  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(express.static(path.join(__dirname, 'public')));

  /* find user */
  app.use(async (req, res, next) => {
    try {
      let user = await User.findOne();
      req.user = user;
      next();
    } catch (err) {
      console.log(err)
    }
  })


  app.use('/admin', adminRoutes);
  app.use(shopRoutes);

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