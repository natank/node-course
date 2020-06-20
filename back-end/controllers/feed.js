const { validationResult } = require('express-validator');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: "fetched posts successfully", posts });
  } catch (err) {
    handleError(err, next)
  }
};

const Post = require('../models/post')
exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.')
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error('No image provided.');
      error.statusCode = 422;
      throw error
    }


    const imageUrl = req.file.location;
    console.log(`req.file = ${JSON.stringify(req.file)}`);
    const title = req.body.title;
    const content = req.body.content;

    // Create post in db
    const post = new Post({
      title: title,
      content: content,
      creator: { name: 'Nati' },
      imageUrl: imageUrl
    })
    const savedPost = await post.save();
    console.log(savedPost)
    res.status(201).json({
      message: 'Post created successfully!',
      post: savedPost
    });
  } catch (err) {
    handleError(err, next)
  }

};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    let post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({ message: 'Post fetched.', post: post })
    }
  } catch (err) {
    handleError(err, next)
  }
}

function handleError(err, next) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err)
}