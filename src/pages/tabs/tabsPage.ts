import {Component} from "@angular/core";
import {StartSurveyComponent} from "../startSurvey/startSurvey.component";
import {MySurveyComponent} from "../mySurveys/mySurveys.component";
import {HomeComponent} from "../home/home.component";
import {PurchaseComponent} from "../purchase/purchase.component";
import {Model} from "../../providers/services/model.service";

@Component({
  template: `<ion-tabs selectedIndex="0">
    <ion-tab tabIcon="home" [root]="homePage"></ion-tab>
    <ion-tab tabIcon="cart" [root]="purchasePage" [tabBadge]="model.claimableRewards > 0 ? model.claimableRewards : ''" tabBadgeStyle="danger"></ion-tab>
    <ion-tab tabTitle="ATP" [root]="startSurveyPage"></ion-tab>
    <ion-tab tabIcon="list-box" [root]="mySurveysPage"></ion-tab>
</ion-tabs>`
})
export class TabsPage {
  homePage: any = HomeComponent;
  purchasePage: any = PurchaseComponent;
  mySurveysPage: any = MySurveyComponent;
  startSurveyPage: any = StartSurveyComponent;

  constructor(public model: Model) {
  }
}
