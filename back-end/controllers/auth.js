const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  validationResult
} = require('express-validator');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    let hashedPw = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      password: hashedPw,
      name,
    })
    let result = user.save()
    res.status(201).json({
      message: 'User Created!',
      userId: result._id
    })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}