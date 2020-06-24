const errors = require('../utils/errors');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { checkErrorAndCallNext, createErrorAndThrow } = errors;
const jwt = require('jsonwebtoken');
exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const errorOptions = {
        str: 'Validation failed',
        statusCode: 422,
        data: errors.array()
      }
      createErrorAndThrow(errorOptions)
    }
    const { email, name, password } = req.body;
    let hashedPw = await bcrypt.hash(password, 12)
    const user = new User({
      email: email,
      password: hashedPw,
      name: name
    });
    let result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    checkErrorAndCallNext(err, next)
  }
}

exports.login = async (req, res, next) => {
  const { email, password, } = req.body;
  let loadedUser
  try {
    const user = await User.findOne({ email })
    if (!user) {
      createErrorAndThrow({
        str: 'A user with this email could not be found.',
        statusCode: 401
      })
    }
    loadedUser = user;
    let isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      createErrorAndThrow({
        str: 'Wrong password!',
        statusCode: 401
      })
    }
    const token = jwt.sign({ email: loadedUser.email, userId: loadedUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    checkErrorAndCallNext(err, next)
  }
}