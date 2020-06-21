const { validationResult } = require('express-validator');
const User = require('../models/user');



exports.signup = (req, res, next) => {
  const { email, name, password } = req.body;

}