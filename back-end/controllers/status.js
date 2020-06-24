const User = require('../models/user');
const errors = require('../utils/errors');
const { checkErrorAndCallNext, createErrorAndThrow } = errors;

exports.getStatus = async function (req, res, next) {
  try {
    if (req.userId) {
      const user = await User.findById(req.userId);
      res.status(200).json({ message: 'Status was found', status: user.status })
    } else {
      res.status(200).json({ message: 'No Status', status: 'no user' })
    }
  } catch (err) {
    // TODO
  }
}

exports.postStatus = async function (req, res, next) {
  try {
    const user = await User.findById(req.userId);
    const status = req.body.status;
    user.status = status;
    await user.save();
    res.status(200).json({
      status
    })
  } catch {
    // TODO
  }
}