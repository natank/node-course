const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

const {
  check,
  body
} = require('express-validator');


// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', [
  body('title').trim().isLength({
    min: 5
  }).withMessage('title must be at least 10 char long'),
  body('content').trim().isLength({
    min: 5
  })
], feedController.createPost);

module.exports = router;