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
    res.writeHead(404);
    res.write('Sorry, but we have no response..\n');
    res.end();
}

function homeHandler(req, res) {
    res.writeHead(200);
    res.write(`
    <h1>Greetings from server</h1>
    <form action=>
        <label>Add User</lable>
        <input/>
        <button type='submit'>Add User</button>
    </form>
    `);
    res.end();
}

function createUserHandler(req, res) {
    res.end();
}

function usersHandler(req, res) {
    res.write(`<html>
    <head></head>
    <body>
    <ul><li>User 1</li><li>User 2</li><li>User 3</li><li>User 4</li></ul>
    </body></html>`)
    res.end();
}

module.exports = {
    homeHandler,
    noResponse,
    createUserHandler,
    usersHandler
}