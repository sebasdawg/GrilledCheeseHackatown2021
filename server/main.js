const { Client } = require('@googlemaps/google-maps-services-js');
let Request = require('request');
var fetch = require("node-fetch");

const client = new Client({});
const googleMapsAPIkey = "AIzaSyASEaBKGj3dqr0s6jV_IfCuhoqv_-ndLls";

let fs = require("fs");
const { waitForDebugger } = require('inspector');
let csv = fs.readFileSync('data/dataJardin.csv',{encoding:'utf8', flag:'r'});
let json = JSON.parse(fs.readFileSync('data/mock-db.json'));
let jardinCSVlines;
let compteur = 0;

processData(csv);

if(json.jardins[0] === undefined){
    csvToJSON(jardinCSVlines);
}

// tryPOSTuser();
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
    jardinTemplate.nombreJardinetsDisponibles = jardinsLines[compteur][8]; 
    jardinTemplate.adresse = reponse;
    
    json.jardins.push(jardinTemplate);
    compteur++;
    fs.writeFileSync('data/mock-db.json', JSON.stringify(json), function(err, result) {
        if(err) console.log('error', err);
    });
}

// function tryPOSTuser() {
//     let getRequest = new fetch.Request("http://127.0.0.1:3000", {method: 'GET'});
//     fetch(getRequest).then(response => response.json())
//     .then(jsonUser =>{
//         console.log(jsonUser.users);
//     });  
    
//     let jsonUserInput = {"name": "", "email": "", "password": "", "adresse": "765 rue monty"};
//     jsonUserInput.name = "Sebastien Dagenais";
//     jsonUserInput.email = "sebasdag@hotmail.com"
//     jsonUserInput.password = "123456qwer";
//     jsonUserInput.adresse = "765 rue monty";
//     input = JSON.stringify(jsonUserInput);

//     let postRequest = new fetch.Request("http://127.0.0.1:3000", {method: 'POST', body: input});

//     // fetch(postRequest)
//     // .then(response => response.jsonUserInput())
//     // .then(data => {
//     //   if(data.status === 200) {  
//     //     console.log("tabarnak");
//     //   }})

//     fetch(postRequest)
//     .then(response => {
//         if(response.status === 200) {  
//             console.log("tabarnak");
//             return response.json();
//         } else {
//             console.log("esti");
//             throw new Error('Something fucked');
//         }
//     })
// }

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible (soit le nom du jardin ou autre) autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}
