const fs = require('fs');

const findPost = require('./helpers').findPost;
// use upath library to convert path from windows to unix style.
let upath = require('upath');
const {
  validationResult
} = require('express-validator');
const Post = require('../models/post');

/**
 * This route handler takes care of updating a post in the DB
 */
module.exports = async (req, res, next) => {
  // extract postId from url params
  try {
    checkErrors(req);
    let updatedPost = await findPost(req.params.postId)
    updateImage(req, updatedPost);
    updateDetails(req, updatedPost);
    saveUpdatedPost(res, updatedPost);
    return;
  } catch (eror) {
    next(eror)
  }
}

function checkErrors(req) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error; // this goes to the next error handling middleware
  }
}




function updateImage(req, updatedPost) {
  let imageUrl = req.body.image;
  if (req.file) {

    fs.unlink(updatedPost.imageUrl, function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
    });
    req.file.path = upath.normalize(req.file.path)
    imageUrl = req.file.path
  }
  if (!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;
    throw error
  }
  updatedPost.imageUrl = imageUrl;
}

function updateDetails(req, updatedPost) {
  updatedPost.title = req.body.title;
  updatedPost.content = req.body.content;
}


async function saveUpdatedPost(res, updatedPost) {
  try {
    let result = await Post.update({
      _id: updatedPost._id
    }, {
      title: updatedPost.title,
      content: updatedPost.content,
      imageUrl: updatedPost.imageUrl
    })
    if (result.nModified != 1) {
      let err = new Error('faild to updated post');
      throw (err);
    }
    res.status(200).json({
      message: 'Post updated!',
      post: updatedPost
    })
  } catch (error) {
    throw (error)
  }

}