import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';
import { map } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  jardins: JSON;
  message: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  informationImported: boolean = false;
  constructor(private communicationService: MessageService) { }

  onSubmit(event:any){
    const adress = event.target.value;
    console.log(adress);
  }
  
  initialize() {
    if(!this.informationImported){
      this.informationImported = true;
      console.log(this.message);
      console.log(this.message.observers);
      console.log(this.message.value);
      let string = this.message.value;
      this.jardins = JSON.parse(string);
      console.log(this.jardins);
    }
  }

  getMessageFromServer(): void {
    this.communicationService
      .basicGet()
      .pipe(
        map((message: string) => {
        return message;
      }),
      ).subscribe(this.message);
  }

  ngOnInit(): void {
    this.getMessageFromServer();
  }
}
