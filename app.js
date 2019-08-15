const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rootFolder = require('./utils/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const r404Routes = require('./routes/404');



const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(path.join(rootFolder, 'public')));
app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use(r404Routes);


app.listen(3000, () => {
    console.log('Server is running at http://127.0.0.1:3000/')
});