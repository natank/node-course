let User = require('../models/user');

exports.getLogin = async (req, res, next) => {
  
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    req.session.user = await User.findOne()
    await req.session.save();
    req.session.isLoggedIn = true;
    res.redirect('/');
  } catch (err) {
    console.log(err)
  }
}

exports.getLogout = async (req, res, next) => {
  try {
    await req.session.destroy()
    res.redirect('/');
  } catch (err) {
    console.log(err)
  }

}