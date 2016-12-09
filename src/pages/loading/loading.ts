import {Component} from "@angular/core";
import {NavController, Platform} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {MessagesService} from "../../providers/services/messages.service";
import {CountryService} from "../../providers/services/country.service";
import {SurveyService} from "../../providers/services/survey.service";
import {AuthService} from "../../providers/services/auth.service";
import {TabsPage} from "../tabs/tabsPage";
import {WelcomePage} from "../welcome/welcome";
import {RewardService} from "../../providers/services/reward.service";
import {LocalStorage} from "../../providers/localStorage.component";
import {LoadingState} from "./loadingState.component";


/**
 * Loading component
 * Specifies where to navigate to and resolves user
 */

@Component({
  templateUrl: 'loading.html'
})
export class LoadingPage {

  constructor(public state: LoadingState,
              public nav: NavController,
              public authService: AuthService,
              public surveyService: SurveyService,
              public countryService: CountryService,
              public feedbackService: MessagesService,
              public rewardService: RewardService,
              public model: Model,
              public platform: Platform,
              public localStorage: LocalStorage) {
    this.loadDataFromServer();
  }

  loadDataFromServer() {
    if(!this.state.loadedLocalStorage) {
      this.loadLocalStorage();
    } else if(!this.state.loadedCountries) {
      this.loadCountries();
    } else if(!this.state.loadedUser) {
      this.loadUser();
    } else if(!this.state.loadedMySurveys) {
      this.loadOrUpdateMySurveys();
    } else if(!this.state.loadedUnreadFeedback) {
      this.loadFeedback();
    } else if(!this.state.loadedAnnouncements) {
      this.loadAnnouncements();
    } else if(!this.state.loadedRewards) {
      this.loadRewards();
    } else if(!this.state.registeredNotifications) {
      this.registerNotification();
    } else {
      this.nav.setRoot(TabsPage);
    }
  }

  loadLocalStorage() {
    this.localStorage.loadData().then(() => {
      this.state.loadedLocalStorage = true;
      this.loadDataFromServer()
    });
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(
      countries => {
        console.log("loaded " + countries.length + " countries");
        this.state.loadedCountries = true;
        this.loadDataFromServer();
      }
    );
  }

  loadUser() {
    if(this.model.user && this.localStorage.getToken()) {
      this.state.loadedUser = true;
      this.loadDataFromServer();
    } else {
      if(this.localStorage.getToken()) {
        this.resolveUser();
      } else {
        this.nav.setRoot(WelcomePage);
      }
    }
  }

  public resolveUser() {
    this.authService.getUser().subscribe(
      data => {
        console.log("Loaded user data");
        this.model.user = data;
        this.state.loadedUser = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadOrUpdateMySurveys() {
    if(this.localStorage.getUpdateTimestamp()) {
      //update always happen when viewing main-page
      this.state.loadedMySurveys = true;
      this.loadDataFromServer();
    } else {
      this.surveyService.getMySurveysBackground().subscribe(
        data => {
          this.localStorage.setMySurveys(data);
          console.log("Loaded " + data.data.length + " surveys");
          this.state.loadedMySurveys = true;
          this.loadDataFromServer();
        }
      );
    }
  }

  public loadFeedback() {
    this.feedbackService.loadFeedback().subscribe(
      data => {
        this.model.feedback = data;
        this.model.recalcUnreadMessages();
        console.log("Loaded " + this.model.feedback.length + " feedback");
        this.state.loadedUnreadFeedback = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadAnnouncements() {
    this.feedbackService.loadAnnouncements().subscribe(
      data => {
        this.model.setAnnouncements(data);
        console.log("Loaded " + this.model.announcements.length + " announcements");
        this.state.loadedAnnouncements = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadRewards() {
    this.rewardService.getRewards().subscribe(
      data => {
        this.model.setRewards(data);
        console.log("Loaded " + this.model.rewards.length + " rewards");
        this.state.loadedRewards = true;
        this.loadDataFromServer();
      }
    );
  }

  public registerNotification() {
    // if(FirebasePlugin) {
    //   try {
    //     FirebasePlugin.getInstanceId(
    //       token => {
    //         let platform = this.platform.is("android") ? "android" : this.platform.is("ios") ? "iOS" : "unknown";
    //         this.authService.postDeviceBackground(platform, token).subscribe(data => this.model.user = data);
    //       },
    //       err => console.log("Error on FirebasePlugin.getInstanceId: " + err)
    //     );
    //     FirebasePlugin.onNotificationOpen(
    //       data => {
    //         alert("Notification: " + JSON.stringify(data) );
    //       },
    //       err => {
    //         alert('Error registering onNotification callback: ' + err);
    //       }
    //     );
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
    this.state.registeredNotifications = true;
    this.loadDataFromServer();
  }
}
