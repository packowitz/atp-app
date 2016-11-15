import {User} from "../providers/domain/user";
import {Platform, Loading} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Feedback} from "../providers/domain/feedback";
import {Survey} from "../providers/domain/survey";
import {Announcement} from "../providers/domain/annoucement";
import {Storage} from "@ionic/storage";
import {Achievement} from "../providers/domain/achievement";

@Injectable()
export class Model {
  public static server: string = "http://localhost:8080";
  public static MainTab = 1;
  public static PurchaseTab = 2;
  public static StartSurveyTab = 3;
  public static MySurveysTab = 4;
  public loading: Loading;
  public user: User;
  public token: string;
  public last3surveys: Survey[] = [];
  public surveyList: Survey[];
  public surveyArchivedList: Survey[];
  public feedback: Feedback[] = [];
  public unreadFeedback: number = 0;
  public announcements: Announcement[] = [];
  public unreadAnnouncements: number = 0;
  public achievements: Achievement[] = [];
  public claimableAchievements: number = 0;
  public achievement_active: Achievement;
  public achievement_username: Achievement;
  public achievement_creator: Achievement;
  public achievement_answerer: Achievement;
  public achievement_reliable: Achievement;
  readAnnouncements: string;

  constructor(public platform: Platform,
              public storage: Storage) {
    if(platform.is("cordova") || platform.is("android") || platform.is("ios")) {
      Model.server = "http://api.askthepeople.io";
    }
    this.storage.get('readAnnouncements').then(data => this.readAnnouncements = data);
  }

  public recalcUnreadMessages() {
    let unreadFeedback = 0;
    let unreadAnnouncements = 0;
    this.feedback.forEach(feedback => unreadFeedback += feedback.unreadAnswers);
    this.announcements.forEach(announcement => {
      if(!this.readAnnouncements || this.readAnnouncements.indexOf('|' + announcement.id + '|') == -1) {
        unreadAnnouncements ++;
      }
    });
    this.unreadFeedback = unreadFeedback;
    this.unreadAnnouncements = unreadAnnouncements;
  }

  public markAnnouncementAsRead() {
    if(!this.readAnnouncements) {
      this.readAnnouncements = '|';
    }
    this.announcements.forEach(
      announcement => {
        if(this.readAnnouncements.indexOf('|' + announcement.id + '|') == -1) {
          this.readAnnouncements += announcement.id + '|'
        }
      }
    );
    this.storage.set('readAnnouncements', this.readAnnouncements).then(() => this.recalcUnreadMessages());
  }

  isUserDataCompleteToAnswerATP(): boolean {
    return this.user.male != null && this.user.country != null && this.user.yearOfBirth != null;
  }

  setAchievements(achievements: Achievement[]) {
    this.achievements = achievements;
    let claimable = 0;
    this.achievements.forEach(a => {
      if(a.claimed < a.achieved) {
        claimable ++;
      }
      if(a.type == 'ACTIVE_USER') {
        this.achievement_active = a;
      } else if(a.type == 'CHOOSE_USERNAME') {
        this.achievement_username = a;
      } else if(a.type == 'ATP_CREATOR') {
        this.achievement_creator = a;
      } else if(a.type == 'ATP_ANSWERER') {
        this.achievement_answerer = a;
      } else if(a.type == 'RELIABLE_USER') {
        this.achievement_reliable = a;
      }
    });
    this.claimableAchievements = claimable;
  }

  needReloadAchievements(): boolean {
    if((this.achievement_username.achieved == 0 && this.user.username)
      || (this.achievement_creator.achieved == 0 && this.user.surveysStarted >=3)
      || (this.achievement_creator.achieved == 1 && this.user.surveysStarted >= 10)
      || (this.achievement_creator.achieved == 2 && this.user.surveysStarted >= 50)
      || (this.achievement_answerer.achieved == 0 && this.user.surveysAnswered >= 50)
      || (this.achievement_answerer.achieved == 1 && this.user.surveysAnswered >= 500)
      || (this.achievement_answerer.achieved == 2 && this.user.surveysAnswered >= 5000)) {
      return true;
    } else {
      return false;
    }
  }

  surveyDeleted(survey: Survey) {
    let idx = -1;
    this.last3surveys.forEach((s, i) => {
      if(s.id == survey.id) {
        idx = i;
      }
    });
    if(idx != -1) {
      console.log("remove from last3surveys " + idx);
      this.last3surveys.splice(idx, 1);
    } else {
      console.log(this.last3surveys);
    }
    if(this.surveyList) {
      idx = -1;
      this.surveyList.forEach((s, i) => {
        if(s.id == survey.id) {
          idx = i;
        }
      });
      if(idx != -1) {
        console.log("remove from surveyList " + idx);
        this.surveyList.splice(idx, 1);
      } else {
        console.log(this.surveyList);
      }
    } else {
      console.log("surveyList is null");
    }
    if(this.surveyArchivedList) {
      idx = -1;
      this.surveyArchivedList.forEach((s, i) => {
        if(s.id == survey.id) {
          idx = i;
        }
      });
      if(idx != -1) {
        this.surveyArchivedList.splice(idx, 1);
      }
    }
  }
}
