const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');

const BUCKET_NAME = process.env.BUCKET_NAME;
let s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});


exports.getFile = async fileName => {
  var params = {
    Bucket: BUCKET_NAME,
    Key: fileName
  };
  let p = new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) reject(err);
      // an error occurred
      else resolve(data); // successful response
    });
  });
  return p;
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimtype === 'image/png' ||
    file.mimtype === 'image/jpg' ||
    file.mimtype === 'image/jpeg'
  ) {
    cb(null, true);
  }
}
let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname)
    },
    fileFilter
  })
})

exports.uploadFile = upload.single('image')

exports.deleteFile = async key => {
  /* Delete an object from an S3 bucket. */

  var params = {
    Bucket: BUCKET_NAME,
    Key: key
  };
  let p = new Promise((resolve, reject) => {
    s3.deleteObject(params, function (err, data) {
      if (err) reject(err);
      // an error occurred
      else resolve(data); // successful response
    });
  });
  return p;
};
