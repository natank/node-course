const fs = require('fs');
const qs = require('querystring');

const router = (req, res)=>{

    const { headers, method, url } = req;
    if (url === '/') {
        
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    } 
    if (url === '/message' && method === 'POST') {
        var body = '';
        req.on('data', function(data){
        body+=data;
        if(body.length>1e6){
            req.connection.destroy();
        }
        })
        req.on('end', function(){
        fs.appendFile('message.txt', qs.parse(body).message, function(err){
            if(err) console.log(err)
            else console.log("message was written")
        })
        })
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }

    res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Home</title></head>');
        res.write('<body><h1>Server home</h1></body>');
        res.write('</html>');
        return res.end();

}

module.exports = router;