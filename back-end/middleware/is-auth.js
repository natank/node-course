const jwt = require('jsonwebtoken');
const { createErrorAndThrow } = require('../utils/errors');


const validateJWT = (req, res, next) => {
  // Check whether auth header exists or not
  console.log(`Validate JWT ------1`)
  const authHeader = req.get('Authorization'); // get the value of the authorization header
  if (!authHeader) {
    createErrorAndThrow({
      str: 'Not authenticated.',
      statusCode: 401
    })
  }
  // get the token and decode
  const token = authHeader.split(' ')[1];
  console.log(`token=${token}`)
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
}

module.exports = validateJWT;