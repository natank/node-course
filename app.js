const express = require('express');
const router = require('./scripts/router');
// const router = express.Router();

const app = express();
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static('public'))
app.use('/', router);


app.listen(3000,()=> console.log('app is listening on port 3000'))