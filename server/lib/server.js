"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var http = __importStar(require("http"));
var fs = __importStar(require("fs"));
var google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
var jsonUser = JSON.parse(fs.readFileSync('data/user-db.json').toString());
var port = 3000;
var hostname = '127.0.0.1';
// const { Client } = require('@googlemaps/google-maps-services-js');
var client = new google_maps_services_js_1.Client({});
var googleMapsAPIkey = "AIzaSyASEaBKGj3dqr0s6jV_IfCuhoqv_-ndLls";
var csv = fs.readFileSync('data/dataJardin.csv', { encoding: 'utf8', flag: 'r' });
var jsonJardins = JSON.parse(fs.readFileSync('data/mock-db.json').toString());
var jardinCSVlines;
var compteur = 0;
processData(csv);
if (jsonJardins.jardins[0] === undefined) {
    csvToJSON(jardinCSVlines);
}
var server = http.createServer(function (req, res) {
    res.setHeader("Content-type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.end(JSON.stringify(jsonJardins));
    if (req.method === 'POST') {
        console.log("New connection asked...");
        var body = '';
        req.on('data', function (data) {
            var newUser = JSON.parse(data);
            if (newUser.name === '' || newUser.email === '' || newUser.password === '' || newUser.adresse === '') {
                console.log("Missing information to create new User");
            }
            else {
                console.log(newUser);
                jsonUser.users.push(newUser);
                fs.writeFile('data/user-db.json', JSON.stringify(jsonUser), function (err) {
                    console.log('New User has been added to json file');
                    res.end("lache mes tomates");
                });
            }
        });
    }
    if (req.method === 'POSTnewJardin') {
        console.log("An user is getting a new garden spot");
        req.on('data', function (data) {
            var newRequest = JSON.parse(data);
            if (newRequest.nomJardin !== "") {
                var dataBase = void 0;
                if (dataBase = JSON.parse(fs.readFileSync('data/mock-db.json').toString())) {
                    var i = 0;
                    while (dataBase[i].nomJardin !== newRequest.nomJardin) {
                        i++;
                    }
                    if (i < dataBase.size()) {
                        if (dataBase[i].nombreJardinsDisponibles >= newRequest.nombrePlacesDemandees) {
                            dataBase[i].nombrePlacesDisponiles = dataBase[i].nombrePlacesDisponiles - newRequest.nombrePlacesDemandees;
                            fs.unlink('data/mock-db.json', function () { });
                            fs.writeFile('data/mock-db.json', JSON.stringify(dataBase), function (err) {
                                console.log('New User has been added to json file');
                                res.end("lache mes tomates");
                            });
                        }
                    }
                }
            }
        });
    }
});
server.on('connection', function () {
    console.log('Client is Connected');
});
server.listen(port, hostname, function () {
    console.log("Server running at http://" + hostname + ":" + port);
});
function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    jardinCSVlines = [];
    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = [];
            for (var j = 0; j < headers.length; j++) {
                tarr.push(data[j]);
            }
            jardinCSVlines.push(tarr);
        }
    }
}
function getFullAdresse(jardinsLines) {
    client.geocode({
        params: {
            components: {
                country: "Canada",
                route: "jardin communautaire " + jardinsLines[compteur][1],
                administrative_area: jardinsLines[compteur][3],
            },
            key: googleMapsAPIkey,
        },
        timeout: 1000,
    }).then(function (r) {
        var string = r.data.results[0].formatted_address;
        writeToFileCallback(jardinsLines, string);
    }).catch(function (e) {
        console.log(e.response.data.error_message);
    });
}
function csvToJSON(jardinsLine) {
    for (var i = 0; i < jardinsLine.length - 1; i++) {
        getFullAdresse(jardinsLine);
    }
}
function writeToFileCallback(jardinsLines, reponse) {
    var jardinTemplate = { "id": "", "nomArrond": "", "nomJardin": "", "adresse": "", "nombreJardinets": "", "nombreJardinetsDisponibles": "" };
    jardinTemplate.id = jardinsLines[compteur][0]; //id
    jardinTemplate.nomArrond = jardinsLines[compteur][3]; //nomAround
    jardinTemplate.nomJardin = jardinsLines[compteur][1]; //nomJardin
    jardinTemplate.nombreJardinets = jardinsLines[compteur][8]; //nombre de jardinets
    jardinTemplate.nombreJardinetsDisponibles = jardinsLines[compteur][8];
    jardinTemplate.adresse = reponse;
    jsonJardins.jardins.push(jardinTemplate);
    compteur++;
    fs.writeFileSync('data/mock-db.json', JSON.stringify(jsonJardins));
    // , (err, result) {
    // if(err) console.log('error', err);
    // });
}
module.exports = null;
