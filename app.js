const express = require('express');

const app = express();

app.use('/', (req, res, next)=>{
    console.log("This always runs!");
    next();
})

app.use('/add-product', (req, res, next)=>{
    console.log('In another middleware');
    res.send('<h1>The "Add Product" Page</h1>')
})

app.use('/',(req, res, next)=>{
    console.log('<h1>In another middleware</h1>');
    res.send('<h1>hello from express</h1>')
})


let processRequest = require('./processRequest');

app.listen(3000, () => {
    console.log('Server is running at http://127.0.0.1:3000/')
});