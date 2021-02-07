const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});
const googleMapsAPIkey = "AIzaSyASEaBKGj3dqr0s6jV_IfCuhoqv_-ndLls";

let fs = require("fs");
let csv = fs.readFileSync('data/dataJardin.csv',{encoding:'utf8', flag:'r'});
let json = JSON.parse(fs.readFileSync('data/mock-db.json'));
let jardinCSVlines;
let compteur = 0;

processData(csv);

if(json.jardins[0] === undefined){
    csvToJSON(jardinCSVlines);
}
// client.distancematrix({
//     params:{
//         origins:["45.5229485,-73.5612738"],
//         destinations:["45.499968294449026,-73.57715331297396"],
//         key: googleMapsAPIkey,
//     },
//     timeout: 1000,
// }).then((r) => {
//     console.log("esti");
//     console.log(r.data.rows[0].elements[0].distance);
// }).catch((e) => {
//     console.log("yikes");
//     console.log(e.response);
// })

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
    let jardinTemplate = {"id": "", "nomArrond": "", "nomJardin": "", "adresse": "", "nombreJardinets": "", "nombreJardinetsOccupes": ""};
    jardinTemplate.id = jardinsLines[compteur][0]; //id
    jardinTemplate.nomArrond = jardinsLines[compteur][3]; //nomAround
    jardinTemplate.nomJardin = jardinsLines[compteur][1]; //nomJardin
    jardinTemplate.nombreJardinets = jardinsLines[compteur][8]; //nombre de jardinets
    jardinTemplate.nombreJardinetsOccupes = 0;
    jardinTemplate.adresse = reponse;
    
    json.jardins.push(jardinTemplate);
    compteur++;
    fs.writeFileSync('data/mock-db.json', JSON.stringify(json), function(err, result) {
        if(err) console.log('error', err);
    });
}
