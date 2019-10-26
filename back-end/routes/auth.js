const express = require('express');
const router = express.Router();

const User = require('../models/user')
const authController = require('../controllers/auth');

const {
  body
} = require('express-validator');

router.put('/signup', [
    body('email').isEmail()
    .withMessage('Please enter a valid email.')
    .custom(checkMultiEmail)
    .withMessage('user with this email is already exists')
    .normalizeEmail(),
    body('password').trim().isLength({
      min: 5
    }),
    body('name').trim().not().isEmpty()
  ],
  authController.signup)

async function checkMultiEmail(email, {
  req,
  res,
  next
}) {
  try {
    let userDoc = await User.findOne({
      email
    }) //email already exist
    if (userDoc) {
      return Promise.reject('User with this email already exists!')
    }
  } catch (error) {
    next(error)
  }
}


module.exports = router;