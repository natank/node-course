let handlers = require('./routerHandlers');
let {getHandler, postHandler,noResponse, usersHandler} = {...handlers};
let processRequest = (req, res) => {
    // create an object for all redirection options
    const router = {
        'GET/users': usersHandler,
        'GET/retrieve-data': getHandler,
        'POST/send-data': postHandler,
        'default': noResponse
        };
    // parse the url by using WHATWG URL API
    let reqUrl = new URL(req.url, 'http://127.0.0.1/');
    // find the related function by searching "method + pathname" and run it
    let redirectedFunc = router[req.method + reqUrl.pathname] || router['default'];
    
    redirectedFunc(req, res, reqUrl);
}

module.exports = processRequest;

