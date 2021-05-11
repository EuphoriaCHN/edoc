const fs = require('fs');
const http = require('http');
const path = require('path');

const INDEX = path.resolve(__dirname, '..', 'dist', 'index.html');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const readStream = fs.createReadStream(INDEX);

    readStream.pipe(res);
}).listen(3000, function() {
    console.log('test server is listening on port 3000');
});
