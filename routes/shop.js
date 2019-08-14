const express = require("express");

const router = express.Router();

router.get('/shop', (req, res, next)=>{
    res.send('<h2>This is the shop</h2>');
})


module.exports = router;
