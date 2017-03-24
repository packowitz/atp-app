import {Component} from "@angular/core";
import {NavController, Platform, AlertController} from "ionic-angular";
import {Model} from "../../providers/services/model.service";
import {MessagesService} from "../../providers/services/messages.service";
import {CountryService} from "../../providers/services/country.service";
import {SurveyService} from "../../providers/services/survey.service";
import {AuthService} from "../../providers/services/auth.service";
import {TabsPage} from "../tabs/tabsPage";
import {WelcomeComponent} from "../welcome/welcome.component";
import {ShopService} from "../../providers/services/shop.service";
import {LocalStorage} from "../../providers/services/localStorage.service";
import {LoadingState} from "./loadingState.component";
import {WelcomeTourComponent} from "../welcome/welcomeTour.component";
import {InAppPurchase} from "ionic-native";
import {Messages} from "../../providers/domain/messages";
import {NotificationService} from "../../providers/services/notification.service";
import {SettingsService} from "../../providers/services/settings.service";
import {SurveyComponent} from "../survey/survey.component";
import {FeedbackComponent} from "../feedback/feedback.component";
import {AnnouncementsComponent} from "../announcements/announcements.component";
import {ConnectivityService} from "../../providers/services/connectivity.service";


declare var FirebasePlugin: any;

@Component({
  templateUrl: 'loading.component.html'
})
export class LoadingComponent {

  startupMessage: string;
  stepMessage: string = "";
  stepsDone: number = 0;
  surveysToLoad: number[] = [];

  constructor(public state: LoadingState,
              public nav: NavController,
              public authService: AuthService,
              public surveyService: SurveyService,
              public countryService: CountryService,
              public feedbackService: MessagesService,
              public shopService: ShopService,
              public settingsService: SettingsService,
              public model: Model,
              public platform: Platform,
              public localStorage: LocalStorage,
              public alertController: AlertController,
              public connectivityService: ConnectivityService,
              public notificationService: NotificationService) {
    this.startupMessage = Messages.getStartupMsg();
    this.loadDataFromServer();

    // Check environment
    if (window.location.href.indexOf("test") > -1) {
      Model.server = "http://api.test.askthepeople.io";
    } else {
      console.log("Using production API");
    }
  }

  /**
   * Load all data from server
   * Note: This will fail with device does not have an active internet connection
   */
  loadDataFromServer() {
    if (this.connectivityService.isOffline()) {
      this.alertController.create({
        title: "Device offline",
        message: "Your device doesn't appear to have access to the internet. Please make sure your data or WiFi is switched on and try again",
        buttons: [{
          text: 'Try again',
          handler: () => {
            this.loadDataFromServer();
          }
        }],
        enableBackdropDismiss: false
      }).present();
    } else {
      if (!this.state.checkedVersion) {
        this.checkVersion();
      } else if (!this.state.loadedLocalStorage) {
        this.stepsDone = 1;
        this.loadLocalStorage();
      } else if (!this.state.loadedCountries) {
        this.stepsDone = 2;
        this.loadCountries();
      } else if (!this.state.loadedUser) {
        this.stepsDone = 3;
        this.loadUser();
      } else if (!this.state.loadedMySurveyIds) {
        this.stepsDone = 4;
        this.loadMySurveyIds();
      } else if (!this.state.loadedMySurveys) {
        this.stepsDone = 5;
        this.loadOrUpdateMySurveys();
      } else if (!this.state.loadedUnreadFeedback) {
        this.stepsDone = 6;
        this.loadFeedback();
      } else if (!this.state.loadedAnnouncements) {
        this.stepsDone = 7;
        this.loadAnnouncements();
      } else if (!this.state.loadedRewards) {
        this.stepsDone = 8;
        this.loadRewards();
      } else if (!this.state.loadedInAppProducts) {
        this.stepsDone = 9;
        this.loadInAppProducts();
      } else if (!this.state.configureFirebase) {
        this.stepsDone = 10;
        this.configureFirebase();
      } else {
        this.stepsDone = 11;
        this.nav.setRoot(this.localStorage.hintSettings.seenWelcomeHint ? TabsPage : WelcomeTourComponent);
      }
    }
  }

  checkVersion() {
    this.stepMessage = "checking version";
    this.authService.checkAppVersion().subscribe(
      data => {
        if(data.success) {
          this.state.checkedVersion = true;
          this.loadDataFromServer();
        } else {
          this.alertController.create({
            title: "New version available",
            message: "Please update ATP. There is a new version in the App Store available.",
            buttons: [],
            enableBackdropDismiss: false
          }).present();
        }
      }
    );
  }

  loadLocalStorage() {
    this.stepMessage = "Reading cache";
    this.localStorage.loadData().then(() => {
      this.state.loadedLocalStorage = true;
      this.loadDataFromServer();
    });
  }

  loadCountries() {
    this.stepMessage = "Loading countries";
    this.countryService.getCountries().subscribe(
      countries => {
        console.log("loaded " + countries.length + " countries");
        this.state.loadedCountries = true;
        this.loadDataFromServer();
      }
    );
  }

  loadUser() {
    this.stepMessage = "Checking your user";
    if(this.model.user && this.localStorage.getToken()) {
      this.state.loadedUser = true;
      this.loadDataFromServer();
    } else {
      if(this.localStorage.getToken()) {
        this.resolveUser();
      } else {
        this.nav.setRoot(WelcomeComponent);
      }
    }
  }

  public resolveUser() {
    this.stepMessage = "Loading your user data";
    this.authService.getUser().subscribe(
      data => {
        console.log("Loaded user data");
        this.model.user = data;
        this.state.loadedUser = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadMySurveyIds() {
    this.stepMessage = "Checking your ATPs";
    this.surveyService.getMySurveyIdsBackground().subscribe(
      data => {
        let ids = data.data;
        if(!this.localStorage.getUpdateTimestamp()) {
          this.localStorage.setTimestamp(data.timestamp);
        }
        ids.forEach(id => {
          if(this.localStorage.getMetaBySurveyId(id) == null) {
            this.surveysToLoad.push(id);
          }
        });
        this.state.loadedMySurveyIds = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadOrUpdateMySurveys() {
    this.stepMessage = "Updating your ATPs";
    if(this.surveysToLoad.length > 0) {
      this.surveyService.getMySurveysByIds(this.surveysToLoad.splice(0,10)).subscribe(
        data => {
          this.localStorage.addSurveys(data);
          console.log("Loaded " + data.length + " surveys");
          this.loadDataFromServer();
        }
      );
    } else {
      this.state.loadedMySurveys = true;
      this.loadDataFromServer();
    }
  }

  public loadFeedback() {
    this.stepMessage = "Loading messages";
    this.feedbackService.loadFeedback().subscribe(
      data => {
        this.model.setFeedback(data);
        console.log("Loaded " + this.model.feedback.length + " feedback. " + this.model.unreadFeedback + " unread.");
        this.state.loadedUnreadFeedback = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadAnnouncements() {
    this.stepMessage = "Loading announcements";
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
    this.stepMessage = "Loading rewards state";
    this.shopService.getRewards().subscribe(
      data => {
        this.model.setRewards(data);
        console.log("Loaded " + this.model.rewards.length + " rewards");
        this.state.loadedRewards = true;
        this.loadDataFromServer();
      }
    );
  }

  public loadInAppProducts() {
    this.stepMessage = "Loading IAPs";
    if(this.platform.is("android") || this.platform.is("ios")) {
      InAppPurchase.getProducts(this.model.inAppProductIds)
        .then(products => {
          console.log("Retrieved " + products.length + " in app products");
          this.model.setInAppProducts(products);
          this.state.loadedInAppProducts = true;
          this.loadDataFromServer();
        })
        .catch(err => {
          console.log(err);
          this.state.loadedInAppProducts = true;
          this.loadDataFromServer();
        });
    } else {
      // dummy data
      this.model.setInAppProducts([
        {productId: 'pax_tiny_bag', title: '500 pax', description: 'tiny bag of 500 pax', price: '$1.49'},
        {productId: 'pax_small_bag', title: '1000 pax', description: 'small bag of 1000 pax', price: '$2.89'},
        {productId: 'pax_medium_bag', title: '5000 pax', description: 'bag of 5000 pax', price: '$9.99'}
      ]);
      this.state.loadedInAppProducts = true;
      this.loadDataFromServer();
    }
  }

  public configureFirebase() {
    this.stepMessage = "configure Firebase";
    if(typeof FirebasePlugin != 'undefined') {
      try {
        FirebasePlugin.getToken(
          token => this.settingsService.updateNotificationToken(token).subscribe(data => this.model.notificationSettings = data),
          err => console.log("Error on FirebasePlugin.getToken: " + err)
        );

        FirebasePlugin.onTokenRefresh(
          token => this.settingsService.updateNotificationToken(token).subscribe(data => this.model.notificationSettings = data),
          err => console.log("Error on FirebasePlugin.onTokenRefresh: " + err)
        );

        FirebasePlugin.onNotificationOpen(
          data => {
            if(data.tap) {
              //refresh the data in the background (atp-finish need no handling because it gets refreshed every time on home screen)
              if(data.type == 'answer') {
                this.feedbackService.loadFeedback().subscribe(data => this.model.setFeedback(data));
                this.nav.push(FeedbackComponent);
              } else if(data.type == 'announcement') {
                this.feedbackService.loadAnnouncements().subscribe(data => this.model.setAnnouncements(data));
                this.nav.push(AnnouncementsComponent);
              } else if(data.type == 'answerable') {
                this.nav.push(SurveyComponent);
              }
            } else {
              if(data.type == 'answer') {
                this.feedbackService.loadFeedback().subscribe(
                  data => {
                    this.model.setFeedback(data);
                    if(this.model.unreadFeedback > 0) {
                      this.notificationService.showToast({
                        message: 'Your feedback was answered',
                        duration: 3000,
                        showCloseButton: true,
                        closeButtonText: 'OK'
                      });
                    }
                  }
                );
              } else if(data.type == 'announcement') {
                this.feedbackService.loadAnnouncements().subscribe(
                  data => {
                    this.model.setAnnouncements(data);
                  }
                );
              } else if(data.type == 'atp-finished') {
                this.surveyService.updateMySurveys();
                this.notificationService.showToast({
                  message: 'Your ATP just finished',
                  duration: 3000,
                  showCloseButton: true,
                  closeButtonText: 'OK'
                });
              } else if(data.type == 'atp-abused') {
                this.surveyService.updateMySurveys();
                this.notificationService.showToast({
                  message: 'Your ATP was marked as inaceptable!',
                  duration: 3000,
                  showCloseButton: true,
                  closeButtonText: 'OK'
                });
              }
            }
          },
          err => console.log('Error registering onNotification callback: ' + err)
        );

      } catch (e) {
        console.log(e);
      }
    }
    this.state.configureFirebase = true;
    this.loadDataFromServer();
  }
}
