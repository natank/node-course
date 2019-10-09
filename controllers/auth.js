let User = require('../models/user');
const bcrypt = require('bcryptjs');
exports.getLogin = async (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    let user = await User.findOne({
      email: email
    });
    if (user) {
      try {
        let doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          await req.session.save();
          res.redirect('/');
        } else {
          req.flash('error', 'Invalid email');
          res.redirect('/login');
        }
      } catch (err) {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error')
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const {
      email,
      password,
      confirmPassword
    } = req.body;
    let userDoc = await User.findOne({
      email: email
    });
    if (userDoc) {
      req.flash('error', 'email already exists');
      return res.redirect('/signup');
    }
    let hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPassword
    });
    let result = await user.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};