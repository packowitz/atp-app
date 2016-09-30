import {Component} from "@angular/core";
import {StartSurveyPage} from "../startSurvey/startSurvey";
import {MySurveysPage} from "../mySurveys/mySurveys";
import {MainPage} from "../main/main";
import {PurchasePage} from "../purchase/purchase";
import {FeedbackPage} from "../messages/messages";
import {Model} from "../../components/model.component";

@Component({
  template: `<ion-tabs selectedIndex="2">
    <ion-tab tabIcon="chatbubbles" [root]="feedbackPage" [tabBadge]="(model.unreadFeedback + model.unreadAnnouncements) > 0 ? (model.unreadFeedback + model.unreadAnnouncements) : ''" tabBadgeStyle="danger"></ion-tab>
    <ion-tab tabIcon="cart" [root]="purchasePage"></ion-tab>
    <ion-tab tabIcon="home" [root]="mainPage"></ion-tab>
    <ion-tab tabIcon="list-box" [root]="mySurveysPage"></ion-tab>
    <ion-tab tabTitle="ATP" [root]="startSurveyPage"></ion-tab>
</ion-tabs>`
})
export class TabsPage {
  feedbackPage: any = FeedbackPage;
  purchasePage: any = PurchasePage;
  mainPage: any = MainPage;
  mySurveysPage: any = MySurveysPage;
  startSurveyPage: any = StartSurveyPage;

  constructor(public model: Model) {
  }
}
