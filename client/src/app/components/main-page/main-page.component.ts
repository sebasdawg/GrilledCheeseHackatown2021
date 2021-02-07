import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor() { }

  
  onSubmit(event:any){
    const adress = event.target.value;
    console.log(adress);
  }

  

  ngOnInit(): void {
  }

}
