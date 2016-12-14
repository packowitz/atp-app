import {Component} from '@angular/core';
import {Platform, ModalController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoadingPage} from "../pages/loading/loading";
import 'rxjs/Rx';
import {Model} from "../components/model.component";
import {SettingsPage} from "../pages/settings/settings.page";
import {FeedbackPage} from "../pages/feedback/feedback.page";
import {HighscorePage} from "../pages/highscore/highscore";
import {AnnouncementsPage} from "../pages/announcements/announcements.page";
import {PersonalDataPage} from "../pages/personalData/personalData.page";
import {AboutPage} from "../pages/about/about.page";
import {GiveFeedbackPage} from "../pages/feedback/giveFeedback.page";

/**
 * Main app controller.
 * Handles initial load of user login token
 * Navigates to either home or login page.
 */

@Component({
  templateUrl: 'app.component.html'
})
export class AtpApp {
  rootPage: any = LoadingPage;

  constructor(public platform: Platform,
              public modalCtrl: ModalController,
              public model: Model) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }

  showSettings() {
    this.modalCtrl.create(SettingsPage).present();
  }

  showAboutPage() {
    this.modalCtrl.create(AboutPage).present();
  }

  showPersonalData() {
    this.modalCtrl.create(PersonalDataPage).present();
  }

  showHighscorePage() {
    this.modalCtrl.create(HighscorePage).present();
  }

  showAnnouncements() {
    this.modalCtrl.create(AnnouncementsPage).present();
  }

  showFeedbackPage() {
    this.modalCtrl.create(FeedbackPage).present();
  }

  showImprovementPage() {
    this.modalCtrl.create(GiveFeedbackPage, {type: 'IMPROVEMENT'}).present();
  }

  showBugReportPage() {
    this.modalCtrl.create(GiveFeedbackPage, {type: 'BUG_REPORT'}).present();
  }

  showMessageSuggestionPage() {
    this.modalCtrl.create(GiveFeedbackPage, {type: 'MESSAGE_SUGGESTION'}).present();
  }

  showOtherFeedbackPage() {
    this.modalCtrl.create(GiveFeedbackPage, {type: 'OTHER'}).present();
  }
}
