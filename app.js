const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const { headers, method, url } = req;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  } else if (url === '/message' && method === 'POST') {
    console.log('message route');
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Greeting from the server</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);
