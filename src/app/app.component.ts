import {Component} from '@angular/core';
import {Platform, ModalController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {Storage} from "@ionic/storage";
import {LoadingPage} from "../pages/loading/loading";
import {WelcomePage} from "../pages/welcome/welcome";
import 'rxjs/Rx';
import {Model} from "../components/model.component";
import {SettingsPage} from "../pages/settings/settings";
import {FeedbackPage} from "../pages/feedback/feedback.page";
import {HighscorePage} from "../pages/highscore/highscore";

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
              public storage: Storage,
              public modalCtrl: ModalController,
              public model: Model) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }

  // Show app settings
  showSettings() {
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();
  }

  // Show feedback page
  showFeedbackPage() {
    let modal = this.modalCtrl.create(FeedbackPage);
    modal.present();
  }

  showHighscorePage() {
    let modal = this.modalCtrl.create(HighscorePage);
    modal.present();
  }

  // Remove token and send to welcome page
  loginPage() {
    // Just set root to login page
    this.rootPage = LoadingPage;
  }
}
