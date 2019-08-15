const express = require('express');
let path = require('path')
let rootPath = require('../utils/path')

const router = express.Router();

router.use(function (req, res, next) {
  res.status(404)
    .sendFile(path.join(rootPath, 'views', '404.html'));
});


module.exports = router;