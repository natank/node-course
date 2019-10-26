const fs = require('fs');
const Post = require('../models/post');
exports.findPost = async function (postId) {
  let post;
  try {
    post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    } else return post
  } catch (error) {
    error.statusCode = 500
    throw error;
  }
}

/**
 * Takes care of 
 * 1. Deleting the post from the DB
 * 2. Deleting the post image
 */
exports.deletePost = async (postId) => {
  try {
    const post = await this.findPost(postId);

    await this.deleteImage(post);
    let result = await Post.deleteOne({
      _id: post._id
    })
    console.log(result);
    return;
  } catch (error) {
    error.statusCode = 500
    throw (error)
  }
}

/**
 * Delete post image
 * @param post - object with 'imageUrl' field
 * @return - promise
 */
exports.deleteImage = post => new Promise((resolve, reject) => {
  fs.exists(post.imageUrl, imageExists => {
    if (imageExists) fs.unlink(post.imageUrl, err => {
      err ? reject(err) : resolve()
      // if no error, file has been deleted successfully
    });
    else resolve();
  })
})