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
              public shopService: ShopService) {
  }

  ionViewDidEnter() {
    this.surveyService.updateMySurveys();
    if(this.model.needReloadRewards()) {
      this.shopService.getRewards().subscribe(data => this.model.setRewards(data));
    }
  }

  showAnonymousAlert() {
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
    this.modalCtrl.create(PersonalDataComponent).present();
  }

  openPurchasePage() {
    this.tabs.select(Model.PurchaseTab);
  }

  openHighscorePage() {
    this.modalCtrl.create(HighscoreComponent).present();
  }

  openMySurveysPage() {
    this.tabs.select(Model.MySurveysTab);
  }

  openSurveyPage() {
    if(this.model.isUserDataCompleteToAnswerATP()) {
      this.nav.push(SurveyComponent);
    } else {
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
    this.modalCtrl.create(AboutComponent).present();
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  openStartSurveyPage() {
    this.tabs.select(Model.StartSurveyTab);
  }
}
