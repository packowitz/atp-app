import {Component} from "@angular/core";
import {NavParams} from "ionic-angular/index";

@Component({
  template: `
<ion-list>
    <ion-list-header>Select feedback type</ion-list-header>
    <button *ngFor="let type of types" (click)="callback(type.key)" clear dark full ion-item>{{type.name}}</button>
</ion-list>
`
})
export class ChooseFeedbackType {
  types: any[] = [
    {key: 'IMPROVEMENT', name: 'Improvement'},
    {key: 'BUG_REPORT', name: 'Report a Bug'},
    {key: 'MESSAGE_SUGGESTION', name: 'Suggest a Message'},
    {key: 'KUDOS', name: 'Thank you'},
    {key: 'OTHER', name: 'Something else'}
  ];
  callback;

  constructor(public navParams: NavParams) {
    this.callback = navParams.get('callback');
  }
}
