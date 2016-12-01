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
import {SettingsPage} from "../pages/settings/settings";
import {SurveyPage} from "../pages/survey/survey";
import {SurveyDetailsPage} from "../pages/surveyDetails/surveyDetails";
import {TabsPage} from "../pages/tabs/tabsPage";
import {WelcomePage} from "../pages/welcome/welcome";
import {AnswerBarComponent} from "../components/answerbar.component";
import {CountrySelection} from "../components/countrySelection.component";
import {Model} from "../components/model.component";
import {HighscoreEntry} from "../pages/highscore/highscoreEntry";
import {ChooseFeedbackType} from "../pages/feedback/chooseFeedbackType";
import {ChooseUsername} from "../pages/settings/chooseUsername.component";
import {NotificationSettings} from "../pages/settings/notifications.component";
import {PersonalData} from "../pages/settings/personalData.component";
import {AtpHttp} from "../providers/atpHttp.service";
import {AuthService} from "../providers/auth.service";
import {CountryService} from "../providers/country.service";
import {HighscoreService} from "../providers/highscore.service";
import {MessagesService} from "../providers/messages.service";
import {SurveyService} from "../providers/survey.service";
import {Storage} from '@ionic/storage';
import {StartSurveyPage} from "../pages/startSurvey/startSurvey";
import {CountryPipe} from "../pipes/country.pipe";
import {AgePipe} from "../pipes/age.pipe";
import {GenderPipe} from "../pipes/gender.pipe";
import {NotificationService} from "../providers/notification.service";
import {SurveyDetailsMenu} from "../components/surveyDetailMenu.component";
import {AchievementService} from "../providers/achievement.service";
import {CouponService} from "../providers/coupon.service";
import {LocalStorage} from "../providers/localStorage.component";
import {SurveyOverviewBar} from "../components/surveyOverviewBar.component";
import {LoadingState} from "../pages/loading/loadingState.component";
import {MultiPictureSurveyDetailsPage} from "../pages/surveyDetails/multiPictureSurveyDetails";

@NgModule({
  declarations: [
    AtpApp,
    HighscorePage,
    LoadingPage,
    HomePage,
    FeedbackPage,
    FeedbackDetailsPage,
    MultiPictureSurveyDetailsPage,
    MySurveysPage,
    PurchasePage,
    SettingsPage,
    StartSurveyPage,
    SurveyPage,
    SurveyDetailsPage,
    TabsPage,
    WelcomePage,

    AnswerBarComponent,
    CountrySelection,
    SurveyOverviewBar,
    HighscoreEntry,
    ChooseFeedbackType,
    ChooseUsername,
    NotificationSettings,
    PersonalData,
    SurveyDetailsMenu,

    AgePipe,
    CountryPipe,
    GenderPipe
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
    AtpApp,
    HighscorePage,
    LoadingPage,
    HomePage,
    FeedbackPage,
    FeedbackDetailsPage,
    MySurveysPage,
    PurchasePage,
    SettingsPage,
    StartSurveyPage,
    SurveyPage,
    SurveyDetailsPage,
    MultiPictureSurveyDetailsPage,
    TabsPage,
    WelcomePage,
    SurveyDetailsMenu,
    CountrySelection,
    ChooseFeedbackType
  ],
  providers: [
    Model,
    AchievementService,
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
