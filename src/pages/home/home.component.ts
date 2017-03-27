///<reference path="../about/about.component.ts"/>
import {NavController, Tabs, AlertController, ModalController} from "ionic-angular";
import {Model} from "../../providers/services/model.service";
import {SurveyComponent} from "../survey/survey.component";
import {SurveyService} from "../../providers/services/survey.service";
import {HighscoreComponent} from "../highscore/highscore.component";
import {Component} from "@angular/core";
import {ShopService} from "../../providers/services/shop.service";
import {Util} from "../../providers/domain/util";
import {LocalStorage} from "../../providers/services/localStorage.service";
import {PersonalDataComponent} from "../personalData/personalData.component";
import {AboutComponent} from "../about/about.component";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent {

  currentYear: number = new Date().getFullYear();

  constructor(public model: Model,
              public localStorage: LocalStorage,
              public nav: NavController,
              public surveyService: SurveyService,
              public tabs: Tabs,
              public alertController: AlertController,
              public modalCtrl: ModalController,
              public shopService: ShopService,
              public analytics: Analytics) {
  }

  ionViewDidEnter() {
    this.surveyService.updateMySurveys();
    if(this.model.needReloadRewards()) {
      this.shopService.getRewards().subscribe(data => this.model.setRewards(data));
    }
    this.analytics.enterPage("Home");
  }

  showAnonymousAlert() {
    this.analytics.event("show_anonymous_alert", {page: "Home"});
    this.alertController.create({
      title: 'Select a username',
      message: 'Please go to \'Personal data\' and choose a username to personalize your account.',
      buttons: [
        {text: 'Personal data', handler: () => {this.openPersonalDataPage();}},
        {text: 'Later'}
      ]
    }).present();
  }

  openPersonalDataPage() {
    this.analytics.event("open_personal_data", {page: "Home"});
    this.modalCtrl.create(PersonalDataComponent).present();
  }

  openPurchasePage() {
    this.analytics.event("open_purchase", {page: "Home"});
    this.tabs.select(Model.PurchaseTab);
  }

  openHighscorePage() {
    this.analytics.event("open_highscore", {page: "Home"});
    this.modalCtrl.create(HighscoreComponent).present();
  }

  openMySurveysPage() {
    this.analytics.event("open_my_atps", {page: "Home"});
    this.tabs.select(Model.MySurveysTab);
  }

  openSurveyPage() {
    if(this.model.isUserDataCompleteToAnswerATP()) {
      this.analytics.event("open_answer_atp", {page: "Home"});
      this.nav.push(SurveyComponent);
    } else {
      this.analytics.event("show_incomplete_data_alert", {page: "Home"});
      this.alertController.create({
        title: 'Tell us something about you',
        message: 'To find ATPs that fits to your profile we need to know a little bit about you. Please go to \'Personal data\' and fill out the \'My data\' section.',
        buttons: [
          {text: 'Personal data', handler: () => {this.openPersonalDataPage();}}
        ]
      }).present();
    }
  }

  openAboutPage() {
    this.analytics.event("open_about", {page: "Home"});
    this.modalCtrl.create(AboutComponent).present();
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  openStartSurveyPage() {
    this.analytics.event("open_create_atp", {page: "Home"});
    this.tabs.select(Model.StartSurveyTab);
  }
}
