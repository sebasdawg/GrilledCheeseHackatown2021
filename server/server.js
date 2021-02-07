const http = require("http");

const port = 3000;
const hostname = '127.0.0.1';

const server = http.createServer(function(req,res){
    res.setHeader("Content-type","application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);

    res.end("hello criss");
});

server.on('connection', ()=>{
    console.log('connecting');
});

server.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}`);
});