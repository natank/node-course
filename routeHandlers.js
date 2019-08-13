const {
    parse
} = require('querystring');
/** if there is no related function which handles the request, then show error message */
function noResponse(req, res) {
    res.writeHead(404);
    res.write('Sorry, but we have no response..\n');
    res.end();
}

function homeHandler(req, res) {
    res.setHeader('Content-Type', 'text/html')
    res.writeHead(200);

    res.write(`
    <h1>Greetings from server</h1>
    <form action='create-user' method='post'>
        <label for ="name" >Add User</lable>
        <input id="name" name="name"/>
        <button type='submit'>Add User</button>
    </form>
    `);
    res.end();
}

function createUserHandler(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let user = parse(body);
        console.log(`name:  ${JSON.stringify(user.name)}`)
    })
    res.writeHead(302, {
        'Location': '/'
    })
    res.end();
}

function usersHandler(req, res) {
    res.setHeader('Content-Type', 'text/html');
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