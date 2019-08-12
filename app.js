let http = require('http');

let processRequest = require('./processRequest');

http.createServer(processRequest).listen(3000, () => {
    console.log('Server is running at http://127.0.0.1:3000/')
});