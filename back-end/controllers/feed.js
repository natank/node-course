const errors = require('../utils/errors');
const { validationResult } = require('express-validator');
const deleteImage = require('../utils/aws-s3').deleteFile;
const Post = require('../models/post')
const User = require('../models/user');
const { checkErrorAndCallNext, createErrorAndThrow } = errors;

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
    checkErrorAndCallNext(err, next)
  }
};


exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      createErrorAndThrow({ str: 'Validation failed, entered data is incorrect.', errorCode: 422 });
    }
    if (!req.file) {
      createErrorAndThrow({ str: 'No image provided.', errorCode: 422 });
    }
    const imageUrl = req.file.location;
    const title = req.body.title;
    const content = req.body.content;

    // Create post in db
    const post = new Post({
      title: title,
      content: content,
      creator: req.userId,
      imageUrl: imageUrl,
    })
    await post.save();
    // Assign the post to the user who created it.
    const creator = await User.findById(req.userId); // find user
    creator.posts.push(post); // push post to user posts
    await creator.save() // save the user to the db

    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: creator._id, name: creator.name }
    });
  } catch (err) {
    checkErrorAndCallNext(err, next)
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    let post = await Post.findById(postId);
    if (!post) {
      createErrorAndThrow({ str: 'Could not find post.', errorCode: 404 })
    } else {
      res.status(200).json({ message: 'Post fetched.', post: post })
    }
  } catch (err) {
    checkErrorAndCallNext(err, next)
  }
}

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    createErrorAndThrow({ str: 'Validation failed, entered data is incorrect.', errorCode: 422 });
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;



  try {
    let post = await Post.findById(postId)
    // check if post exists
    if (!post) {
      createErrorAndThrow('Could not find post.', 404)
    }

    // check if image was uploaded
    let imageUrl = post.imageUrl;
    if (req.file) {
      imageUrl = req.file.location;
      // means that the front end wanted to update the image but didn't upload the new one correctly.
      if (!imageUrl) {
        createErrorAndThrow({ str: 'No file picked.', errorCode: 422 })
      }
    }

    // Check authorization
    if (post.creator.toString() !== req.userId) {
      createErrorAndThrow({
        str: 'Not authorized',
        statusCode: 403
      })
    }
    // Delete the old image if a new one was uploaded
    const isImageUpdated = (imageUrl !== post.imageUrl);
    if (isImageUpdated) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    let result = await post.save();
    res.status(200).json({ message: 'Post updated.', post: result })

  } catch (err) {
    checkErrorAndCallNext(err, next);
  }
}

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    let post = await Post.findById(postId);
    if (!post) {
      createErrorAndThrow({ str: 'Could not find post.', errorCode: 404 })
    } else {

      // Check authorization
      ((creator, user) => {
        if (creator !== user) {
          createErrorAndThrow({
            str: 'Not authorized',
            statusCode: 403
          })
        }
      })(post.creator.toString(), req.userId)

      clearImage(post.imageUrl);
      let result = await Post.findByIdAndRemove(postId);

      let user = await User.findById(req.userId);
      user.posts.pull(postId);
      result = await user.save();
      res.status(200).json({ message: 'deleted post.' });
    }

  } catch (err) {
    checkErrorAndCallNext(err, next);
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


