/** handle GET request */
function getHandler(req, res, reqUrl) {
    console.log("GET");
    res.writeHead(200);
    res.write('GET parameters: ' + reqUrl.searchParams);
    res.end();
}
/** handle POST request */
function postHandler(req, res, reqUrl) {

    console.log("GET");
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
        res.writeHead(200);
        res.write('POST parameters: ' + chunk);
        res.end();
    });
}
/** if there is no related function which handles the request, then show error message */
function noResponse(req, res) {
    console.log("GET");
    res.writeHead(404);
    res.write('Sorry, but we have no response..\n');
    res.end();
}

module.exports = {
    getHandler: getHandler,
    postHandler: postHandler,
    noResponse: noResponse
}