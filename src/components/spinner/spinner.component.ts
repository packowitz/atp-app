import {Component, Input} from "@angular/core";

@Component({
  selector: 'spinner',
  template:
    `<div class="spinner">
        <span *ngIf="message">{{message}}</span>
        <ion-spinner name="crescent"></ion-spinner>
    </div>`
})
export class SpinnerComponent {
  @Input() message: string;
}
