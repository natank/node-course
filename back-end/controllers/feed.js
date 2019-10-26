const mongoose = require('mongoose');
const Post = require('../models/post');
const updatePost = require('./feedUpdatePost');
const helpers = require('./helpers');

// use upath library to convert path from windows to unix style.
let upath = require('upath');

const {
  validationResult
} = require('express-validator');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  try {
    let totalItems = await Post.find().countDocuments();

    let posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "fetched posts successfuly",
      posts,
      totalItems
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); //throw doesn't work in async code
  }

};

exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    next(error); // this goes to the next error handling middleware
  } else if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    next(error)
  } else {
    req.file.path = upath.normalize(req.file.path)
    // Create post in db
    try {

      let post = await Post.create({
        title,
        content,
        imageUrl: req.file.path,
        creator: {
          name: 'Nati'
        }
      })

      res.status(201).json({
        message: 'Post created successfully!',
        post: {
          _id: new Date().toISOString(),
          title: post.title,
          content: post.content,
          creator: {
            name: 'Nati'
          },
          createdAt: new Date()
        }
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); //throw doesn't work in async code
    }
  }
};

exports.getPost = async (req, res, next) => {

  const postId = req.params.postId;
  try {
    let post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error
    }
    res.status(200).json({
      message: 'Post fetched.',
      post: post
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); //throw doesn't work in async code
  }
}

exports.updatePost = updatePost;

exports.deletePost = async (req, res, next) => {
  try {
    await helpers.deletePost(req.params.postId);
    res.status(200).json({
      message: 'Post deleted'
    })
  } catch (error) {
    next(error)
  }
}