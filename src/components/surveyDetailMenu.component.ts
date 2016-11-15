import {ViewController, NavParams} from "ionic-angular";
import {Survey} from "../providers/domain/survey";
import {Component} from "@angular/core";

@Component({
  template: `
    <ion-list style="margin: 0;">
      <ion-item *ngIf="survey.status != 'FINISHED'" (click)="refresh()">
        <ion-icon name="refresh" item-left></ion-icon> Refresh
      </ion-item>
      <ion-item *ngIf="survey.status != 'ABUSE'" (click)="tweak()">
        <ion-icon name="share-alt" item-left></ion-icon> Tweak
      </ion-item>
      <ion-item class="text-danger" (click)="delete()">
        <ion-icon name="remove-circle" item-left></ion-icon> Delete
      </ion-item>
    </ion-list>
  `,
})
export class SurveyDetailsMenu {
  survey: Survey;
  callbacks;

  constructor(public navParams: NavParams, public viewController: ViewController) {
    this.survey = navParams.get('survey');
    this.callbacks = navParams.get('callbacks')
  }

  refresh() {
    this.callbacks.refresh();
    this.viewController.dismiss();
  }

  tweak() {
    this.callbacks.tweak();
    this.viewController.dismiss();
  }

  delete() {
    this.callbacks.delete();
    this.viewController.dismiss();
  }
}
