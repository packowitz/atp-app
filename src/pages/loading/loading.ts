import {Component} from "@angular/core";
import {NavController, Platform} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {MessagesService} from "../../providers/messages.service";
import {CountryService} from "../../providers/country.service";
import {SurveyService} from "../../providers/survey.service";
import {AuthService} from "../../providers/auth.service";
import {TabsPage} from "../tabs/tabsPage";
import {WelcomePage} from "../welcome/welcome";
import {Storage} from "@ionic/storage";
import {AchievementService} from "../../providers/achievement.service";

declare var FirebasePlugin: any;

@Component({
  templateUrl: 'loading.html'
})
export class LoadingPage {
  loadedCountries: boolean = false;
  loadedUser: boolean = false;
  loadedLast3Surveys: boolean = false;
  loadedUnreadFeedback: boolean = false;
  loadedAnnouncements: boolean = false;
  loadedAchievements: boolean = false;
  registeredNotifications: boolean = false;

  constructor(public nav: NavController,
              public authService: AuthService,
              public surveyService: SurveyService,
              public countryService: CountryService,
              public feedbackService: MessagesService,
              public achievementService: AchievementService,
              public model: Model,
              public platform: Platform,
              public storage: Storage) {
    this.loadDataFromServer();
  }

  loadDataFromServer() {
    if(!this.loadedCountries) {
      this.loadCountries();
    } else if(!this.loadedUser) {
      this.loadUser();
    } else if(!this.loadedLast3Surveys) {
      this.loadLast3Surveys();
    } else if(!this.loadedUnreadFeedback) {
      this.loadFeedback();
    } else if(!this.loadedAnnouncements) {
      this.loadAnnouncements();
    } else if(!this.loadedAchievements) {
      this.loadAchievements();
    } else if(!this.registeredNotifications) {
      this.registerNotification();
    } else {
      this.nav.setRoot(TabsPage);
    }
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(
      countries => {
        console.log("loaded " + countries.length + " countries");
        this.loadedCountries = true;
        this.loadDataFromServer();
      }
    );
  }

  loadUser() {
    if(this.model.user && this.model.token) {
      this.loadedUser = true;
      this.loadDataFromServer();
    } else {
      this.storage.get('token').then(token => {
        if(token) {
          this.resolveUser(token);
        } else {
          this.nav.setRoot(WelcomePage);
        }
      });
    }
  }

  public resolveUser(token: string) {
    this.authService.getUserByToken(token).subscribe(
      data => {
        console.log("Loaded user data");
        this.model.user = data;
        this.loadedUser = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadLast3Surveys() {
    this.surveyService.getLast3Surveys().subscribe(
      data => {
        this.model.last3surveys = data;
        console.log("Loaded " + this.model.last3surveys.length + " last surveys");
        this.loadedLast3Surveys = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadFeedback() {
    this.feedbackService.loadFeedback().subscribe(
      data => {
        this.model.feedback = data;
        this.model.recalcUnreadMessages();
        console.log("Loaded " + this.model.feedback.length + " feedback");
        this.loadedUnreadFeedback = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadAnnouncements() {
    this.feedbackService.loadAnnouncements().subscribe(
      data => {
        this.model.announcements = data;
        this.model.recalcUnreadMessages();
        console.log("Loaded " + this.model.announcements.length + " announcements");
        this.loadedAnnouncements = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadAchievements() {
    this.achievementService.getAchievements().subscribe(
      data => {
        this.model.setAchievements(data);
        console.log("Loaded " + this.model.achievements.length + " achievements");
        this.loadedAchievements = true;
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
    this.registeredNotifications = true;
    this.loadDataFromServer();
  }
}
