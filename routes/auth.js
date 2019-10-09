const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.getLogout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword)
router.post('/new-password', authController.postNewPassword);
module.exports = router;