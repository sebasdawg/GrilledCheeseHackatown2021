const http = require("http");
let fs = require('fs');
let jsonUser = JSON.parse(fs.readFileSync('data/user-db.json'));

const port = 3000;
const hostname = '127.0.0.1';

const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});
const googleMapsAPIkey = "AIzaSyASEaBKGj3dqr0s6jV_IfCuhoqv_-ndLls";

let csv = fs.readFileSync('data/dataJardin.csv',{encoding:'utf8', flag:'r'});
let jsonJardins = JSON.parse(fs.readFileSync('data/mock-db.json'));
let jardinCSVlines;
let compteur = 0;

processData(csv);

if(jsonJardins.jardins[0] === undefined){
    csvToJSON(jardinCSVlines);
}

const server = http.createServer(function(req,res){
    res.setHeader("Content-type","application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.end(JSON.stringify(jsonJardins));

    if(req.method === 'POST'){
        console.log("New connection asked...");
        var body = '';
        req.on('data', function(data){
            let newUser = JSON.parse(data);
            if(newUser.name === '' || newUser.email === '' || newUser.password === '' || newUser.adresse === ''){
                console.log("Missing information to create new User");
            } else {
                console.log(newUser);
                jsonUser.users.push(newUser);
                fs.writeFile('data/user-db.json', JSON.stringify(jsonUser), finished);
                function finished(err){
                    console.log('New User has been added to json file');
                    res.end("lache mes tomates");
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
                            fs.writeFile('data/mock-db.json', JSON.stringify(database), finished);
                        }
                    }
                }
            }
        })
    }
    
    
});

server.on('connection', () => {
    console.log('Client is Connected');
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    jardinCSVlines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            jardinCSVlines.push(tarr);
        }
    }
}

function getFullAdresse(jardinsLines) {
    client.geocode({
        params:{
            components: { 
                country: "Canada",
                route: `jardin communautaire ${jardinsLines[compteur][1]}`,
                administrative_area: jardinsLines[compteur][3],
            },
            key: googleMapsAPIkey,
        }, 
        timeout : 1000,
    }).then((r) => {
        string = r.data.results[0].formatted_address;
        writeToFileCallback(jardinsLines, string);
    }).catch((e) =>{
        console.log(e.response.data.error_message);
    })
}

function csvToJSON(jardinsLine) {
    for (i = 0; i < jardinsLine.length - 1; i++){ 
        getFullAdresse(jardinsLine);
    }
}

function writeToFileCallback(jardinsLines, reponse) {
    let jardinTemplate = {"id": "", "nomArrond": "", "nomJardin": "", "adresse": "", "nombreJardinets": "", "nombreJardinetsDisponibles": ""};
    jardinTemplate.id = jardinsLines[compteur][0]; //id
    jardinTemplate.nomArrond = jardinsLines[compteur][3]; //nomAround
    jardinTemplate.nomJardin = jardinsLines[compteur][1]; //nomJardin
    jardinTemplate.nombreJardinets = jardinsLines[compteur][8]; //nombre de jardinets
    jardinTemplate.nombreJardinetsDisponibles = jardinsLines[compteur][8]; 
    jardinTemplate.adresse = reponse;
    
    jsonJardins.jardins.push(jardinTemplate);
    compteur++;
    fs.writeFileSync('data/mock-db.json', JSON.stringify(jsonJardins), function(err, result) {
        if(err) console.log('error', err);
    });
}