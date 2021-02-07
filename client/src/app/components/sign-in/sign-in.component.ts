import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {
    sendJSon();
  }

}

function sendJSon() {
  let getRequest = new Request('http://127.0.0.1:3000/', {method: 'GET'});

  fetch(getRequest)
    .then(response => response.json())
    .then(json => {
      console.log(json.users);
    });
  
    document.querySelector('#send').addEventListener('click', function (event)  {
    event.preventDefault();
    let name = (<HTMLInputElement>document.getElementById('name')).value;
    let adresse = (<HTMLInputElement>document.getElementById('address')).value;
    let email = (<HTMLInputElement>document.getElementById('email')).value;
    let password = (<HTMLInputElement>document.getElementById('password')).value;
    let json = {'name': "",'adresse': "", 'email': "", 'password': ""};
    json.name = name;
    json.adresse=adresse;
    json.email = email;
    json.password = password;
    console.log(json);

    let postRequest = new Request('http://127.0.0.1:3000/', {method: 'POST', body: JSON.stringify(json)});
    
    fetch(postRequest)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Something went wrong on api server!');
        }
      });
  });
}
