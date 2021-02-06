import express from 'express';
const http = require("http");

let app = express();

const server = http.createServer(function(req,res){
    res.setHeader("Content-type","application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);

    res.end("hello criss");
});

server.on('connection', ()=>{
    console.log('connecting');
})

server.listen(3000, function() {
    console.log("aaaaaaaah");
})