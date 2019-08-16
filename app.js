const express = require('express');

const app = express();
app.use(express.static('public'));

const user = require('./routes/user');
const show = require('./routes/show');

app.get('/', (req, res) => {
  res.redirect('/show')
})
app.use('/user', user)
app.use('/show', show)

app.listen(3000, () => console.log("server listening on port 3000"))