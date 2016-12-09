import {NavController, Tabs, AlertController, ModalController} from "ionic-angular";
import {Model} from "../../components/model.component";
import {SurveyPage} from "../survey/survey";
import {SurveyService} from "../../providers/services/survey.service";
import {SettingsPage} from "../settings/settings";
import {HighscorePage} from "../highscore/highscore";
import {Component} from "@angular/core";
import {RewardService} from "../../providers/services/reward.service";
import {Util} from "../../components/util.component";
import {LocalStorage} from "../../providers/localStorage.component";

@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  currentYear: number = new Date().getFullYear();

  constructor(public model: Model,
              public localStorage: LocalStorage,
              public nav: NavController,
              public surveyService: SurveyService,
              public tabs: Tabs,
              public alertController: AlertController,
              public modalCtrl: ModalController,
              public rewardService: RewardService) {
  }

  ionViewDidEnter() {
    this.surveyService.updateMySurveys();
    if(this.model.needReloadRewards()) {
      this.rewardService.getRewards().subscribe(data => this.model.setRewards(data));
    }
  }

  showAnonymousAlert() {
    this.alertController.create({
      title: 'Select a username',
      message: 'Go to settings and choose a username to use your ATP account on multiple devices or to be able to restore your account.',
      buttons: [
        {text: 'Settings', handler: () => {this.openSettingsPage();}},
        {text: 'Later'}
      ]
    }).present();
  }

  openSettingsPage() {
    this.nav.push(SettingsPage);
  }

  openPurchasePage() {
    this.tabs.select(Model.PurchaseTab);
  }

  openHighscorePage() {
    let modal = this.modalCtrl.create(HighscorePage);
    modal.present();
  }

  openMySurveysPage() {
    this.tabs.select(Model.MySurveysTab);
  }

  openSurveyPage() {
    if(this.model.isUserDataCompleteToAnswerATP()) {
      this.nav.push(SurveyPage);
    } else {
      this.alertController.create({
        title: 'Tell us something about you',
        message: 'To find questions to fit to the right person we need to know something about you. Please go to the settings and fill out the personal data section.',
        buttons: [
          {text: 'Settings', handler: () => {this.openSettingsPage();}}
        ]
      }).present();
    }
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  openStartSurveyPage() {
    this.tabs.select(Model.StartSurveyTab);
  }
}
