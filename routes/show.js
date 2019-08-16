const express = require('express');
const router = express.Router();
const path = require('path');
const rootFolder = require('../utils/rootFolder')


router.get('/', (req, res) => {
  res.sendFile(path.join(rootFolder, 'views', 'users.html'))
})

module.exports = router;