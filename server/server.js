const http = require("http");
let fs = require('fs');
let jsonUser = JSON.parse(fs.readFileSync('data/user-db.json'));

const port = 4200;
const hostname = '127.0.0.1';

const server = http.createServer(function(req,res){
    res.setHeader("Content-type","application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);

    if(req.method === 'POSTuser'){
        console.log("New connection asked...");
        var body = '';
        req.on('data', function(data){
            let newUser = JSON.parse(data);
            if(newUser.name === '' || newUser.email === '' || newUser.password === '' || newUser.adress === ''){
                console.log("Missing information to create new User");
            } else {
                console.log(newUser);
                jsonUser.users.push(newUser);
                fs.writeFile('data/user-db.json', JSON.stringify(jsonUser), finished);
                function finished(err){
                    console.log('New User has been added to json file');
                }
            }
        })
    }
    if(req.method === 'POSTnewJardin') {
        console.log("An user is getting a new garden spot");
        req.on('user', 'data', function(user, data) {
            let newRequest = JSON.parse(data);
            if(newRequest.nomJardin !== ""){
                if(dataBase = JSON.parse(fs.readFileSync('data/mock-db.json'))){
                    let i = 0;
                    while(dataBase[i].nomJardin !== newRequest.nomJardin){
                        i++;
                    }
                    if(i < dataBase.size()) {
                        if(dataBase[i].nombreJardinsDisponibles >= newRequest.nombrePlacesDemandees){
                            dataBase[i].nombrePlacesDisponiles = dataBase[i].nombrePlacesDisponiles - newRequest.nombrePlacesDemandees;
                            fs.unlink('data/mock-db.json');
                            fs.writeFileSync('data/mock-db.json', JSON.stringify(database), finished);
                        }
                    }
                }
            }
        })
    }
    res.end("bye criss");
});

server.on('connection', ()=>{
    console.log('connecting');
});


server.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}`);
});