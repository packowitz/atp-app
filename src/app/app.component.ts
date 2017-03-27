import {Component} from '@angular/core';
import {Platform, ModalController} from 'ionic-angular';
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
import {Analytics} from "../providers/services/analytics.service";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";

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
              public model: Model,
              public analytics: Analytics,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  showSettings() {
    this.analytics.event("open_settings", {page: "Menu"});
    this.modalCtrl.create(SettingsComponent).present();
  }

  showAboutPage() {
    this.analytics.event("open_about", {page: "Menu"});
    this.modalCtrl.create(AboutComponent).present();
  }

  showPersonalData() {
    this.analytics.event("open_personal_data", {page: "Menu"});
    this.modalCtrl.create(PersonalDataComponent).present();
  }

  showHighscorePage() {
    this.analytics.event("open_highscore", {page: "Menu"});
    this.modalCtrl.create(HighscoreComponent).present();
  }

  showAnnouncements() {
    this.analytics.event("open_announcements", {page: "Menu"});
    this.modalCtrl.create(AnnouncementsComponent).present();
  }

  showFeedbackPage() {
    this.analytics.event("open_feedback", {page: "Menu"});
    this.modalCtrl.create(FeedbackComponent).present();
  }

  showImprovementPage() {
    this.analytics.event("open_write_feedback_improvement", {page: "Menu"});
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'IMPROVEMENT'}).present();
  }

  showBugReportPage() {
    this.analytics.event("open_write_feedback_bug", {page: "Menu"});
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'BUG_REPORT'}).present();
  }

  showMessageSuggestionPage() {
    this.analytics.event("open_write_feedback_message", {page: "Menu"});
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'MESSAGE_SUGGESTION'}).present();
  }

  showOtherFeedbackPage() {
    this.analytics.event("open_write_feedback_other", {page: "Menu"});
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'OTHER'}).present();
  }
}
