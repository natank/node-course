let User = require('../models/user').User;

exports.getLogin = async (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    req.session.user = await User.findOne()
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