import {Component} from "@angular/core";
import {StartSurveyPage} from "../startSurvey/startSurvey";
import {MySurveysPage} from "../mySurveys/mySurveys";
import {HomePage} from "../home/home";
import {PurchasePage} from "../purchase/purchase";
import {Model} from "../../components/model.component";

@Component({
  template: `<ion-tabs selectedIndex="0">
    <ion-tab tabIcon="home" [root]="homePage"></ion-tab>
    <ion-tab tabIcon="cart" [root]="purchasePage" [tabBadge]="model.claimableAchievements > 0 ? model.claimableAchievements : ''" tabBadgeStyle="danger"></ion-tab>
    <ion-tab tabTitle="ATP" [root]="startSurveyPage"></ion-tab>
    <ion-tab tabIcon="list-box" [root]="mySurveysPage"></ion-tab>
</ion-tabs>`
})
export class TabsPage {
  homePage: any = HomePage;
  purchasePage: any = PurchasePage;
  mySurveysPage: any = MySurveysPage;
  startSurveyPage: any = StartSurveyPage;

  constructor(public model: Model) {
  }
}
