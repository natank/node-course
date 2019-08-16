const express = require('express');
const path = require('path');
const rootFolder = require('../utils/rootFolder')

const router = express.Router();


router.get('/add', (req, res) => {
  // show add-user form
  res.sendFile(path.join(rootFolder, 'views', 'add-user.html'))
})
router.post('/add', (req, res) => {
  res.redirect('/user/add');
})


module.exports = router