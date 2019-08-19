const express = require('express');

const router = express.Router();

const users = ["Ami", "Haya"];



router.get('/users', (req, res) => {
    res.render('show-users', {
        users,
        title: "users"
    })
})

router.get('/add-user', (req, res) => {
    res.render('add-user', {
        title: "Add User"
    })
})

router.post('/user', (req, res) => {
    users.push(req.body.username);
    res.redirect('/add-user');
})

router.get('/', (req, res) => {
    res.redirect('/add-user')
})

module.exports = router;