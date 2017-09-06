import {User} from "../domain/user";
import {Platform} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Feedback} from "../domain/feedback";
import {Announcement} from "../domain/annoucement";
import {Storage} from "@ionic/storage";
import {Reward} from "../domain/reward";
import {SurveyType} from "../domain/surveyType";
import {InAppProduct} from "../domain/inAppProduct";
import {NotificationSettings} from "../domain/notificationSettings";
import {AgeRange} from "../domain/ageRange";

@Injectable()
export class Model {
  public static server: string = "http://localhost:8080";
  public static MainTab = 0;
  public static PurchaseTab = 1;
  public static StartSurveyTab = 2;
  public static MySurveysTab = 3;
  public user: User;
  public ageRanges: AgeRange[];
  public notificationSettings: NotificationSettings;
  public surveyTypes: SurveyType[];
  public inAppProductIds: string[];
  public inAppProducts: InAppProduct[] = [];
  public feedback: Feedback[] = [];
  public unreadFeedback: number = 0;
  public announcements: Announcement[] = [];
  public rewards: Reward[] = [];
  public claimableRewards: number = 0;
  public reward_active: Reward;
  public reward_username: Reward;
  public reward_secured: Reward;
  public reward_creator: Reward;
  public reward_answerer: Reward;
  public reward_reliable: Reward;
  readAnnouncements: string;
  unreadAnnouncements: number = 0;

  constructor(public platform: Platform,
              public storage: Storage) {
    if(platform.is("cordova") || platform.is("android") || platform.is("ios")) {
      Model.server = "https://api.askthepeople.io";
    }
    this.storage.get('readAnnouncements').then(data => this.readAnnouncements = data ? data : '|');

    this.surveyTypes = [
      {key: 'NUMBER100', name: 'Quick Check', answers: 100, costs: 1000},
      {key: 'NUMBER300', name: 'Reliable Check', answers: 300, costs: 2900},
      {key: 'NUMBER1000', name: 'Research Check', answers: 1000, costs: 9000}
    ];

    this.ageRanges = [
      {id: 1, name: 'Child', description: '9 yrs and under'},
      {id: 2, name: 'Pre teen', description: 'between 10 and 12'},
      {id: 3, name: 'Young teen', description: 'between 13 and 15'},
      {id: 4, name: 'Teenager', description: 'between 16 and 17'},
      {id: 5, name: 'Senior teen', description: 'between 18 and 21'},
      {id: 6, name: 'Young adult', description: 'between 22 and 29'},
      {id: 7, name: 'Adult', description: 'between 30 and 39'},
      {id: 8, name: 'Senior adult', description: 'between 40 and 55'},
      {id: 9, name: 'Elderly', description: '56 yrs and older'}
    ];

    this.inAppProductIds = ['pax_tiny_bag', 'pax_small_bag', 'pax_medium_bag'];
  }

  public recalcUnreadMessages() {
    let unreadFeedback = 0;
    this.feedback.forEach(feedback => unreadFeedback += feedback.unreadAnswers);
    this.unreadFeedback = unreadFeedback;
  }

  public setFeedback(feedback: Feedback[]) {
    if(feedback && feedback.length > 0) {
      this.feedback = feedback;
    }
    this.recalcUnreadMessages();
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
    this.storage.set('readAnnouncements', this.readAnnouncements);
  }

  public setAnnouncements(announcements: Announcement[]) {
    if(announcements && announcements.length > 0) {
      announcements.forEach(announcement => announcement.read = this.readAnnouncements.indexOf('|' + announcement.id + '|') != -1);
      this.announcements = announcements;
    }
    this.recalcUnreadAnnouncements();
  }

  isUserDataCompleteToAnswerATP(): boolean {
    return this.user.male != null && this.user.country != null && this.user.ageRange != null;
  }

  setRewards(rewards: Reward[]) {
    this.rewards = rewards;
    let claimable = 0;
    this.rewards.forEach(a => {
      if(a.claimed < a.achieved) {
        claimable ++;
      }
      if(a.type == 'ACTIVE_USER') {
        this.reward_active = a;
      } else if(a.type == 'CONFIRM_EMAIL') {
        this.reward_secured = a;
      } else if(a.type == 'CHOOSE_USERNAME') {
        this.reward_username = a;
      } else if(a.type == 'ATP_CREATOR') {
        this.reward_creator = a;
      } else if(a.type == 'ATP_ANSWERER') {
        this.reward_answerer = a;
      } else if(a.type == 'RELIABLE_USER') {
        this.reward_reliable = a;
      }
    });
    this.claimableRewards = claimable;
  }

  setInAppProducts(products: InAppProduct[]) {
    this.inAppProducts = products;
  }

  needReloadRewards(): boolean {
    return !!((this.reward_username.achieved == 0 && this.user.username)
    || (this.reward_secured.achieved == 0 && this.user.emailConfirmed)
    || (this.reward_creator.achieved == 0 && this.user.surveysStarted >= 3)
    || (this.reward_creator.achieved == 1 && this.user.surveysStarted >= 10)
    || (this.reward_creator.achieved == 2 && this.user.surveysStarted >= 50)
    || (this.reward_answerer.achieved == 0 && this.user.surveysAnswered >= 50)
    || (this.reward_answerer.achieved == 1 && this.user.surveysAnswered >= 500)
    || (this.reward_answerer.achieved == 2 && this.user.surveysAnswered >= 5000));
  }

  getAgeRange(id: number) : AgeRange {
    return this.ageRanges.find(range => range.id == id);
  }
}
