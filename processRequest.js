let handlers = require('./routeHandlers');
let {
    noResponse,
    usersHandler,
    homeHandler,
    createUserHandler
} = {
    ...handlers
};
let processRequest = (req, res) => {
    // create an object for all redirection options
    const router = {
        'GET/': homeHandler,
        'GET/users': usersHandler,
        'POST/create-user': createUserHandler,
        'default': noResponse
    };
    // parse the url by using WHATWG URL API
    let reqUrl = new URL(req.url, 'http://127.0.0.1/');
    console.log(req.method + reqUrl.pathname)
    // find the related function by searching "method + pathname" and run it
    let redirectedFunc = router[req.method + reqUrl.pathname] || router['default'];
    redirectedFunc(req, res, reqUrl);
    console.log(router);
}

module.exports = processRequest;