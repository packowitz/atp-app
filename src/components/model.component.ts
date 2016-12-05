import {User} from "../providers/domain/user";
import {Platform} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Feedback} from "../providers/domain/feedback";
import {Announcement} from "../providers/domain/annoucement";
import {Storage} from "@ionic/storage";
import {Achievement} from "../providers/domain/achievement";
import {SurveyType} from "../providers/domain/surveyType";

@Injectable()
export class Model {
  public static server: string = "http://localhost:8080";
  public static MainTab = 0;
  public static PurchaseTab = 1;
  public static StartSurveyTab = 2;
  public static MySurveysTab = 3;
  public user: User;
  public surveyTypes: SurveyType[];
  public feedback: Feedback[] = [];
  public unreadFeedback: number = 0;
  public announcements: Announcement[] = [];
  public achievements: Achievement[] = [];
  public claimableAchievements: number = 0;
  public achievement_active: Achievement;
  public achievement_username: Achievement;
  public achievement_creator: Achievement;
  public achievement_answerer: Achievement;
  public achievement_reliable: Achievement;
  readAnnouncements: string;
  unreadAnnouncements: number = 0;

  constructor(public platform: Platform,
              public storage: Storage) {
    if(platform.is("cordova") || platform.is("android") || platform.is("ios")) {
      Model.server = "http://api.askthepeople.io";
    }
    this.storage.get('readAnnouncements').then(data => this.readAnnouncements = data ? data : '|');

    this.surveyTypes = [
      {key: 'NUMBER100', name: 'Quick Check', answers: 100, costs: 1000},
      {key: 'NUMBER300', name: 'Reliable Check', answers: 300, costs: 2900},
      {key: 'NUMBER1000', name: 'Research Check', answers: 1000, costs: 9000}
    ];
  }

  public recalcUnreadMessages() {
    let unreadFeedback = 0;
    this.feedback.forEach(feedback => unreadFeedback += feedback.unreadAnswers);
    this.unreadFeedback = unreadFeedback;
  }

  public recalcUnreadAnnouncements() {
    let unreadAnnouncements = 0;
    this.announcements.forEach(announcement => unreadAnnouncements += announcement.read ? 0 : 1);
    this.unreadAnnouncements = unreadAnnouncements;
  }

  public markAnnouncementAsRead(announcement: Announcement) {
    if(!this.readAnnouncements) {
      this.readAnnouncements = '|';
    }
    this.readAnnouncements += announcement.id + '|';
    announcement.read = true;
    this.recalcUnreadAnnouncements();
    this.storage.set('readAnnouncements', this.readAnnouncements).then(() => this.recalcUnreadMessages());
  }

  public setAnnouncements(announcements: Announcement[]) {
    if(announcements && announcements.length > 0) {
      announcements.forEach(announcement => announcement.read = this.readAnnouncements.indexOf('|' + announcement.id + '|') != -1);
      this.announcements = announcements;
    }
    this.recalcUnreadAnnouncements();
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
}
