exports.updatePost = async (req, res, next) => {
  // extract postId from url params
  let p = new Promise((resolve, reject) => {
    try {
      checkErrors(req);
      let updatedPost = findPost(req)
      updateImage(req, updatedPost);
      updateDetails(req, updatedPost);
      saveUpdatedPost(updatedPost)
    } catch (eror) {
      next(eror)
    }
  })
  return p;
}

function checkErrors(req) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error; // this goes to the next error handling middleware
  }
}

async function findPost(req) {
  let post;
  try {
    post = await Post.findById(req.param.postId)
  } catch (eror) {
    eror.statusCode = 500
    throw eror;
  }
  if (!post) {
    const error = new Error('Could not find post.');
    error.statusCode = 404;
    throw error;
  } else {
    return post
  }
}

function updateImage(req, updatedPost) {
  let imageUrl = req.body.image;
  if (req.file) {
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
  updatedPost.imageUrl = req.imageUrl;
  updatedPost.content = req.body.content;
  updatedPost;
}

function saveUpdatedPost(updatedPost) {
  let result = await updatedPost.save()
  res.status(200).json({
    message: 'Post updated!',
    post: result
  })
}