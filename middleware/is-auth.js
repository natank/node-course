module.exports = (req, res, next) => {
  if ((req.session.isLoggedIn)) {
    next();
  } else {
    req.flash('error', 'You must be logged in to access this page');
    return (res.redirect('/login'))
  }
}