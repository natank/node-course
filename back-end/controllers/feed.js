const { validationResult } = require('express-validator');
const deleteImage = require('../utils/aws-s3').deleteFile;
const Post = require('../models/post')
exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    const count = await Post.find().countDocuments();

    totalItems = count;

    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ message: "fetched posts successfully", posts, totalItems });


  } catch (err) {
    handleError(err, next)
  }
};


exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      createErrorAndThrow('Validation failed, entered data is incorrect.', 422);
    }
    if (!req.file) {
      createErrorAndThrow('No image provided.', 422);
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
      createErrorAndThrow('Could not find post.', 404)
    } else {
      res.status(200).json({ message: 'Post fetched.', post: post })
    }
  } catch (err) {
    handleError(err, next)
  }
}

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    createErrorAndThrow('Validation failed, entered data is incorrect.', 422);
  }
  const { postId, title, content } = req.params;
  if (req.file) {
    imageUrl = req.file.location;
  }
  // Error occurs if - no imageUrl in body and no imageUrl in req.file
  // means that the front end wanted to update the image but didn't upload the new one correctly.
  if (!imageUrl) {
    createErrorAndThrow('No file picked.', 422)
  }

  try {
    let post = await Post.findById(postId)
    if (!post) {
      createErrorAndThrow('Could not find post.', 404)
    } else {

      // Delete the old image if a new one was uploaded
      const isImageUpdated = (imageUrl !== post.imageUrl);
      if (isImageUpdated) {
        clearImage(post.imageUrl);
      }

      post = { ...post, title, imageUrl, content }

      let result = await post.save();
      res.status(200).json({ message: 'Post updated.', post: result })
    }
  } catch (err) {
    handleError(err, next);
  }
}

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    let post = await Post.findById(postId);
    if (!post) {
      createErrorAndThrow('Could not find post.', 404)
    } else {
      // check logged in user
      clearImage(post.imageUrl);
      let result = await Post.findByIdAndRemove(postId);
      console.log(result);
      res.status(200).json({ message: 'deleted post.' });
    }

  } catch (err) {
    handleError(err, next);
  }
}



const clearImage = imageUrl => {
  // example file path:
  // https://eduactivity-blog.s3-us-west-2.amazonaws.com/1592598866305cat.jpg
  // extract the key = file name
  const pieces = imageUrl.split('/');
  const key = pieces[pieces.length - 1];
  // return a promise
  return deleteImage(key)
}



function handleError(err, next) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err)
}

function createErrorAndThrow(str, code) {
  const error = new Error(str)
  error.statusCode = code;
  throw error;
}
