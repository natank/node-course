// Used to handle error within a catch block from a controller or middleware
exports.checkErrorAndCallNext = function (err, next) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err)
}

// Used to create a new error from a middleware function
exports.createErrorAndThrow = function (options) {
  const error = new Error(options.str)
  error.statusCode = options.statusCode;
  error.data = options.data;
  console.log(`error: ${error}`)
  console.log(`error data: ${error.data}`)
  throw error;
}
