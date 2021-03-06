import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {AtpApp} from "./app.component";
import {HighscoreComponent} from "../pages/highscore/highscore.component";
import {LoadingComponent} from "../pages/loading/loading.component";
import {HomeComponent} from "../pages/home/home.component";
import {FeedbackComponent} from "../pages/feedback/feedback.component";
import {FeedbackDetailsComponent} from "../pages/feedback/feedbackDetails.component";
import {MySurveyComponent} from "../pages/mySurveys/mySurveys.component";
import {PurchaseComponent} from "../pages/purchase/purchase.component";
import {SettingsComponent} from "../pages/settings/settings.component";
import {SurveyComponent} from "../pages/survey/survey.component";
import {SurveyDetailsComponent} from "../pages/surveyDetails/surveyDetails.component";
import {TabsPage} from "../pages/tabs/tabsPage";
import {WelcomeComponent} from "../pages/welcome/welcome.component";
import {Model} from "../providers/services/model.service";
import {HighscoreEntryComponent} from "../pages/highscore/highscoreEntry.component";
import {ChooseUsernameComponent} from "../pages/settings/chooseUsername.component";
import {AtpHttp} from "../providers/services/atpHttp.service";
import {AuthService} from "../providers/services/auth.service";
import {CountryService} from "../providers/services/country.service";
import {HighscoreService} from "../providers/services/highscore.service";
import {MessagesService} from "../providers/services/messages.service";
import {SurveyService} from "../providers/services/survey.service";
import {IonicStorageModule} from "@ionic/storage";
import {StartSurveyComponent} from "../pages/startSurvey/startSurvey.component";
import {CountryPipe} from "../providers/pipes/country.pipe";
import {AgePipe} from "../providers/pipes/age.pipe";
import {GenderPipe} from "../providers/pipes/gender.pipe";
import {NotificationService} from "../providers/services/notification.service";
import {SurveyDetailsMenuComponent} from "../components/surveyDetailMenu.component";
import {ShopService} from "../providers/services/shop.service";
import {CouponService} from "../providers/services/coupon.service";
import {LocalStorage} from "../providers/services/localStorage.service";
import {SurveyOverviewBar} from "../components/survey-overview/surveyOverviewBar.component";
import {LoadingState} from "../pages/loading/loadingState.component";
import {MultiPictureSurveyDetailsComponent} from "../pages/surveyDetails/multiPictureSurveyDetails.component";
import {SingleSurveyBar} from "../components/single-survey-bar/singleSurveyBar.component";
import {SurveyContainsPicturePipe} from "../providers/pipes/surveyContainsPicture.pipe";
import {AnnouncementsComponent} from "../pages/announcements/announcements.component";
import {PersonalDataComponent} from "../pages/personalData/personalData.component";
import {AboutComponent} from "../pages/about/about.component";
import {GiveFeedbackComponent} from "../pages/feedback/giveFeedback.component";
import {SpinnerComponent} from "../components/spinner/spinner.component";
import {SettingsService} from "../providers/services/settings.service";
import {CountrySelectionComponent} from "../pages/countrySelection/countrySelection.component";
import {ConnectivityService} from "../providers/services/connectivity.service";
import {Camera} from "@ionic-native/camera";
import {Firebase} from "@ionic-native/firebase";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {Analytics} from "../providers/services/analytics.service";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {UserdataPopover} from "../pages/home/userdata.popover";
import {Network} from "@ionic-native/network";
import {Device} from "@ionic-native/device";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SafeHtmlPipe} from "../providers/pipes/safeHtml.pipe";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtTokenInterceptor} from "../providers/interceptors/jwt_token.interceptor";

@NgModule({
  declarations: [
    AnnouncementsComponent,
    AtpApp,
    HighscoreComponent,
    LoadingComponent,
    HomeComponent,
    FeedbackComponent,
    FeedbackDetailsComponent,
    GiveFeedbackComponent,
    MultiPictureSurveyDetailsComponent,
    MySurveyComponent,
    PersonalDataComponent,
    PurchaseComponent,
    SettingsComponent,
    StartSurveyComponent,
    SurveyComponent,
    SurveyDetailsComponent,
    TabsPage,
    WelcomeComponent,
    AboutComponent,
    SpinnerComponent,

    CountrySelectionComponent,
    SingleSurveyBar,
    SurveyOverviewBar,
    HighscoreEntryComponent,
    ChooseUsernameComponent,
    SurveyDetailsMenuComponent,
    UserdataPopover,

    AgePipe,
    CountryPipe,
    GenderPipe,
    SafeHtmlPipe,
    SurveyContainsPicturePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(AtpApp, {
        tabsPlacement: 'bottom',
        tabsHideOnSubPages: true
      }
    ),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AnnouncementsComponent,
    AtpApp,
    HighscoreComponent,
    LoadingComponent,
    HomeComponent,
    FeedbackComponent,
    FeedbackDetailsComponent,
    GiveFeedbackComponent,
    MySurveyComponent,
    PersonalDataComponent,
    PurchaseComponent,
    SettingsComponent,
    StartSurveyComponent,
    SurveyComponent,
    SurveyDetailsComponent,
    MultiPictureSurveyDetailsComponent,
    TabsPage,
    WelcomeComponent,
    AboutComponent,
    CountrySelectionComponent,

    UserdataPopover,
    SurveyDetailsMenuComponent,
  ],
  providers: [
    Analytics,
    AtpHttp,
    AuthService,
    Camera,
    CountryService,
    CouponService,
    Firebase,
    HighscoreService,
    InAppPurchase,
    LoadingState,
    LocalStorage,
    MessagesService,
    Model,
    NotificationService,
    SettingsService,
    ShopService,
    SplashScreen,
    StatusBar,
    SurveyService,
    ConnectivityService,
    Network,
    Device,
    {provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
