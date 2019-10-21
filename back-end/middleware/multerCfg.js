// multerCfg.js
// Config multer middleware

const path = require('path');
const multer = require('multer');

const destination = (req, file, cb) => {
  const appDir = path.join('images')
  cb(null, appDir);
};

const filename = (req, file, cb) => {
  cb(
    null,
    new Date()
    .toISOString()
    .replace(/\-/g, '')
    .replace(/\:/g, '') + file.originalname
  );
};

const fileStorage = multer.diskStorage({
  destination,
  filename
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = {
  fileStorage,
  fileFilter
};