import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {AtpApp} from './app.component';
import {HighscorePage} from "../pages/highscore/highscore";
import {LoadingPage} from "../pages/loading/loading";
import {MainPage} from "../pages/main/main";
import {FeedbackPage} from "../pages/messages/messages";
import {FeedbackDetailsPage} from "../pages/messages/feedbackDetails";
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
import {SurveyListComponent} from "../components/surveyList.component";
import {HighscoreEntry} from "../pages/highscore/highscoreEntry";
import {ChooseFeedbackType} from "../pages/messages/chooseFeedbackType";
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

@NgModule({
  declarations: [
    AtpApp,
    HighscorePage,
    LoadingPage,
    MainPage,
    FeedbackPage,
    FeedbackDetailsPage,
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
    SurveyListComponent,
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
    MainPage,
    FeedbackPage,
    FeedbackDetailsPage,
    MySurveysPage,
    PurchasePage,
    SettingsPage,
    StartSurveyPage,
    SurveyPage,
    SurveyDetailsPage,
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
    HighscoreService,
    MessagesService,
    NotificationService,
    SurveyService,
    Storage
  ]
})
export class AppModule {}
