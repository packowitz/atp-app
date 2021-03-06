import {ViewController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";

@Component({
  template: `
    <ion-list style="margin: 0;">
      <ion-item *ngIf="showRefresh" (click)="refresh()">
        <ion-icon name="refresh" color="atp-placeholder-grey" item-left></ion-icon> Refresh
      </ion-item>
      <ion-item *ngIf="showDelete" class="text-danger" (click)="delete()">
        <ion-icon name="remove-circle" color="danger" item-left></ion-icon> Delete
      </ion-item>
    </ion-list>
  `,
})
export class SurveyDetailsMenuComponent {
  showRefresh: boolean = false;
  showDelete: boolean = false;
  callbacks;

  constructor(public navParams: NavParams, public viewController: ViewController) {
    this.showRefresh = navParams.get('showRefresh');
    this.showDelete = navParams.get('showDelete');
    this.callbacks = navParams.get('callbacks');
  }

  refresh() {
    this.callbacks.refresh();
    this.viewController.dismiss();
  }

  delete() {
    this.callbacks.delete();
    this.viewController.dismiss();
  }
}
