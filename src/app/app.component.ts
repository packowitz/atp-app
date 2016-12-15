import {Component} from '@angular/core';
import {Platform, ModalController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoadingComponent} from "../pages/loading/loading.component";
import 'rxjs/Rx';
import {Model} from "../providers/services/model.service";
import {SettingsComponent} from "../pages/settings/settings.component";
import {FeedbackComponent} from "../pages/feedback/feedback.component";
import {HighscoreComponent} from "../pages/highscore/highscore.component";
import {AnnouncementsComponent} from "../pages/announcements/announcements.component";
import {PersonalDataComponent} from "../pages/personalData/personalData.component";
import {AboutComponent} from "../pages/about/about.component";
import {GiveFeedbackComponent} from "../pages/feedback/giveFeedback.component";

/**
 * Main app controller.
 * Handles initial load of user login token
 * Navigates to either home or login page.
 */

@Component({
  templateUrl: 'app.component.html'
})
export class AtpApp {
  rootPage: any = LoadingComponent;

  constructor(public platform: Platform,
              public modalCtrl: ModalController,
              public model: Model) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }

  showSettings() {
    this.modalCtrl.create(SettingsComponent).present();
  }

  showAboutPage() {
    this.modalCtrl.create(AboutComponent).present();
  }

  showPersonalData() {
    this.modalCtrl.create(PersonalDataComponent).present();
  }

  showHighscorePage() {
    this.modalCtrl.create(HighscoreComponent).present();
  }

  showAnnouncements() {
    this.modalCtrl.create(AnnouncementsComponent).present();
  }

  showFeedbackPage() {
    this.modalCtrl.create(FeedbackComponent).present();
  }

  showImprovementPage() {
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'IMPROVEMENT'}).present();
  }

  showBugReportPage() {
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'BUG_REPORT'}).present();
  }

  showMessageSuggestionPage() {
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'MESSAGE_SUGGESTION'}).present();
  }

  showOtherFeedbackPage() {
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'OTHER'}).present();
  }
}
