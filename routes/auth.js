const express = require('express');
const {
  check,
  body
} = require('express-validator/check');
const User = require('../models/user');
const authController = require('../controllers/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/login', authController.getLogin)

router.post('/login', [
  body('email')
  .isEmail().withMessage('Please enter a valid email')
  .custom(async (value, {
    req
  }) => {
    let {
      email
    } = req.body
    let user = await User.findOne({
      email: email
    })
    if (!user) {
      throw new Error('Incorrect email')
    } else {
      req.user = user;
      return true;
    }
  }).withMessage('Email does not exist!!'),
  body('password', "password error").isLength({
    min: 5
  }).withMessage('password must be 5 chars or more')
  .isAlphanumeric().withMessage('password must contain only letters and numbers')
  .custom(async (value, {
    req
  }) => {
    let {
      password
    } = req.body
    if (req.user) {
      let doMatch = await bcrypt.compare(password, req.user.password);
      if (doMatch) return true
      else throw new Error('Incorrect password')
    }
  })

], authController.postLogin)

router.get('/logout', authController.getLogout)
router.get('/signup', authController.getSignup)

router.post('/signup', [check('email')
    .isEmail()
    .withMessage('Please enter a valid email').custom((value, {
      req
    }) => {
      // if (value === 'test@test.com') {
      //   throw new Error('This email address is forbidden.');
      // } else {
      //   return true;
      // }
      let p = new Promise(async (resolve, reject) => {
        let userDoc = await User.findOne({
          email: req.body.email
        });
        if (userDoc) {
          reject('email already exists');
        }
        resolve();
      })
      return p;
    }),
    body('password', "default error message").isLength({
      min: 5
    }).withMessage('password must be 5 chars or more')
    .isAlphanumeric().withMessage('password must contain only letters and numbers'),
    body('confirmPassword').custom((value, {
      req
    }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!')
      } else {
        return true;
      }
    }).withMessage('Passwords have to match')
  ],
  authController.postSignup)

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword);
module.exports = router;