import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {AtpApp} from './app.component';
import {HighscorePage} from "../pages/highscore/highscore";
import {LoadingPage} from "../pages/loading/loading";
import {HomePage} from "../pages/home/home";
import {FeedbackPage} from "../pages/feedback/feedback.page";
import {FeedbackDetailsPage} from "../pages/feedback/feedbackDetails";
import {MySurveysPage} from "../pages/mySurveys/mySurveys";
import {PurchasePage} from "../pages/purchase/purchase";
import {SettingsPage} from "../pages/settings/settings.page";
import {SurveyPage} from "../pages/survey/survey";
import {SurveyDetailsPage} from "../pages/surveyDetails/surveyDetails";
import {TabsPage} from "../pages/tabs/tabsPage";
import {WelcomePage} from "../pages/welcome/welcome";
import {CountrySelection} from "../components/countrySelection.component";
import {Model} from "../components/model.component";
import {HighscoreEntry} from "../pages/highscore/highscoreEntry";
import {ChooseUsername} from "../pages/settings/chooseUsername.component";
import {AtpHttp} from "../providers/services/atpHttp.service";
import {AuthService} from "../providers/services/auth.service";
import {CountryService} from "../providers/services/country.service";
import {HighscoreService} from "../providers/services/highscore.service";
import {MessagesService} from "../providers/services/messages.service";
import {SurveyService} from "../providers/services/survey.service";
import {Storage} from '@ionic/storage';
import {StartSurveyPage} from "../pages/startSurvey/startSurvey";
import {CountryPipe} from "../providers/pipes/country.pipe";
import {AgePipe} from "../providers/pipes/age.pipe";
import {GenderPipe} from "../providers/pipes/gender.pipe";
import {NotificationService} from "../providers/services/notification.service";
import {SurveyDetailsMenu} from "../components/surveyDetailMenu.component";
import {RewardService} from "../providers/services/reward.service";
import {CouponService} from "../providers/services/coupon.service";
import {LocalStorage} from "../providers/localStorage.component";
import {SurveyOverviewBar} from "../components/surveyOverviewBar.component";
import {LoadingState} from "../pages/loading/loadingState.component";
import {MultiPictureSurveyDetailsPage} from "../pages/surveyDetails/multiPictureSurveyDetails";
import {SingleSurveyBar} from "../components/singleSurveyBar.component";
import {SurveyContainsPicturePipe} from "../providers/pipes/surveyContainsPicture";
import {AnnouncementsPage} from "../pages/announcements/announcements.page";
import {PersonalDataPage} from "../pages/personalData/personalData.page";
import {AboutPage} from "../pages/about/about.page";
import {GiveFeedbackPage} from "../pages/feedback/giveFeedback.page";
import {WelcomeTourPage} from "../pages/welcome/welcomeTour.page";
import {SpinnerComponent} from "../providers/spinner/spinner.component";

@NgModule({
  declarations: [
    AnnouncementsPage,
    AtpApp,
    HighscorePage,
    LoadingPage,
    HomePage,
    FeedbackPage,
    FeedbackDetailsPage,
    GiveFeedbackPage,
    MultiPictureSurveyDetailsPage,
    MySurveysPage,
    PersonalDataPage,
    PurchasePage,
    SettingsPage,
    StartSurveyPage,
    SurveyPage,
    SurveyDetailsPage,
    TabsPage,
    WelcomePage,
    WelcomeTourPage,
    AboutPage,
    SpinnerComponent,

    CountrySelection,
    SingleSurveyBar,
    SurveyOverviewBar,
    HighscoreEntry,
    ChooseUsername,
    SurveyDetailsMenu,

    AgePipe,
    CountryPipe,
    GenderPipe,
    SurveyContainsPicturePipe
  ],
  imports: [
    IonicModule.forRoot(AtpApp, {
        tabsPlacement: 'bottom',
        tabsHideOnSubPages: true
      }
    )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AnnouncementsPage,
    AtpApp,
    HighscorePage,
    LoadingPage,
    HomePage,
    FeedbackPage,
    FeedbackDetailsPage,
    GiveFeedbackPage,
    MySurveysPage,
    PersonalDataPage,
    PurchasePage,
    SettingsPage,
    StartSurveyPage,
    SurveyPage,
    SurveyDetailsPage,
    MultiPictureSurveyDetailsPage,
    TabsPage,
    WelcomePage,
    WelcomeTourPage,
    AboutPage,

    SurveyDetailsMenu,
    CountrySelection
  ],
  providers: [
    Model,
    RewardService,
    AtpHttp,
    AuthService,
    CountryService,
    CouponService,
    HighscoreService,
    LoadingState,
    LocalStorage,
    MessagesService,
    NotificationService,
    SurveyService,
    Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
