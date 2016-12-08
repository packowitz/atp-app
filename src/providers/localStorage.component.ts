import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import {Survey} from "./domain/survey";
import {SurveyListWithTimestamp} from "./survey.service";
import {Storage} from "@ionic/storage";
import {MetaSurvey, SurveyPicture} from "./domain/surveyMeta";
import {SurveySettings} from "../components/surveySettings";

@Injectable()
export class LocalStorage {
  prefix: string;

  token: string;
  updateTimestamp: number;
  surveys: MetaSurvey[];

  lastSurveySettings: SurveySettings;

  constructor(public platform: Platform, public storage: Storage) {
    if(platform.is("cordova") || platform.is("android") || platform.is("ios")) {
      this.prefix = "atp-app-";
    } else {
      this.prefix = "atp-app-dev-";
    }
    console.log("localstorage prefix is " + this.prefix);
  }

  loadData(): Promise<any> {
    return this.storage.get(this.prefix + 'token').then(data => {
      this.token = data;
      return this.storage.get(this.prefix + 'updateTimestamp').then(data => {
        this.updateTimestamp = data;
        return this.storage.get(this.prefix + 'surveys').then(data => {
          this.surveys = data ? data : [];
          return this.storage.get(this.prefix + 'lastSurveySettings').then(data => {
            this.lastSurveySettings = data;
          });
        });
      });
    });
  }

  clearStorage() {
    this.token = null;
    this.updateTimestamp = null;
    this.surveys = [];
    this.storage.clear();
  }

  public getToken(): string {
    return this.token;
  }

  public setToken(token: string) {
    this.token = token;
    this.storage.set(this.prefix + 'token', this.token);
  }

  public getLastSurveySettings(): SurveySettings {
    return this.lastSurveySettings;
  }

  public setLastSurveySettings(settings: SurveySettings) {
    this.lastSurveySettings = settings;
    this.storage.set(this.prefix + 'lastSurveySettings', this.lastSurveySettings);
  }

  public getUpdateTimestamp() {
    return this.updateTimestamp;
  }

  public setMySurveys(data: SurveyListWithTimestamp) {
    this.updateTimestamp = data.timestamp;
    if(data.data && data.data.length > 0) {
      data.data.forEach(survey => this.addSurvey(survey));
    }
    this.recalculateSurveys();
    this.storage.set(this.prefix + 'updateTimestamp', this.updateTimestamp);
    this.storage.set(this.prefix + 'surveys', this.surveys);
  }

  public addSurveys(surveys: Survey[]) {
    surveys.forEach(survey => this.addSurvey(survey));
    this.recalculateSurveys();
    this.storage.set(this.prefix + 'surveys', this.surveys);
  }

  addSurvey(survey: Survey) {
    let alreadyExists: MetaSurvey = this.getMetaBySurveyId(survey.id);
    if(!alreadyExists) {
      if(survey.groupId) {
        let meta: MetaSurvey = this.surveys.find(meta => meta.groupId == survey.groupId);
        if(meta) {
          this.addSurveyToMeta(meta, survey);
        } else {
          this.addAsMetaSurvey(survey);
        }
      } else {
        this.addAsMetaSurvey(survey);
      }
    } else {
      this.updateSurveyOfMeta(alreadyExists, survey);
    }
  }

  addAsMetaSurvey(survey: Survey) {
    this.surveys.push(new MetaSurvey(survey));
    this.surveys.sort((survey1, survey2) => survey1.startedDate < survey2.startedDate ? 1 : -1);
  }

  deleteSurvey(survey: Survey) {
    let idx = -1;
    this.surveys.forEach((s, i) => {
      if(s.ids.indexOf(survey.id) != -1) {
        idx = i;
      }
    });
    if(idx != -1) {
      this.surveys.splice(idx, 1);
    }
  }

  deleteSurveyByGroupId(groupId: number) {
    let idx = -1;
    this.surveys.forEach((s, i) => {
      if(s.groupId == groupId) {
        idx = i;
      }
    });
    if(idx != -1) {
      this.surveys.splice(idx, 1);
    }
  }

  public updateMySurveys(data: SurveyListWithTimestamp): number[] {
    let unknownSurveys: number[] = [];
    this.updateTimestamp = data.timestamp;
    if(data.data && data.data.length > 0) {
      data.data.forEach(update => {
        let metaSurvey: MetaSurvey = this.getMetaBySurveyId(update.id);
        if(metaSurvey) {
          this.updateSurveyOfMeta(metaSurvey, update);
        } else {
          unknownSurveys.push(update.id);
        }
      });
    }
    this.recalculateSurveys();
    this.storage.set(this.prefix + 'updateTimestamp', this.updateTimestamp);
    this.storage.set(this.prefix + 'surveys', this.surveys);
    return unknownSurveys;
  }

  public getMetaBySurveyId(id: number): MetaSurvey {
    let metaSurvey;
    if(this.surveys && this.surveys.length > 0) {
      metaSurvey = this.surveys.find(meta => meta.ids.indexOf(id) != -1);
    }
    return metaSurvey ? metaSurvey : null;
  }

  public getSurveyById(id: number): Survey {
    let meta = this.getMetaBySurveyId(id);
    return meta ? meta.surveys.find(survey => survey.id == id) : null;
  }

  addSurveyToMeta(meta: MetaSurvey, survey: Survey) {
    meta.ids.push(survey.id);
    meta.surveys.push(survey);
    if(meta.countries != 'ALL') {
      if(survey.countries == 'ALL') {
        meta.countries = 'ALL';
      } else {
        survey.countries.split(',').forEach(
          country => {
            if(meta.countries.indexOf(country) == -1) {
              meta.countries += "," + country;
            }
          }
        );
      }
    }
    meta.dirtyFlag = true;
  }

  updateSurveyOfMeta(meta: MetaSurvey, update: Survey) {
    let survey: Survey = meta.surveys.find(survey => survey.id == update.id);
    survey.status = update.status;
    survey.answered = update.answered;
    survey.noOpinionCount = update.noOpinionCount;
    survey.pic1Count = update.pic1Count;
    survey.pic2Count = update.pic2Count;
    if(update.answers && update.answers.length > 0) {
      survey.answers = update.answers;
    }
    meta.dirtyFlag = true;
  }

  recalculateSurveys() {
    this.surveys.forEach(meta => {
      if(meta.dirtyFlag) {
        meta.answered = 0;
        meta.pictures = [];
        meta.surveys.forEach(survey => {
          if(survey.status == 'ACTIVE') {
            meta.status = survey.status;
          }
          meta.answered += survey.answered;
          let pic1 = meta.pictures.find(pic => pic.pictureId == survey.pic1_id);
          if(!pic1) {
            pic1 = new SurveyPicture(survey.pic1_id, survey.pic1);
            meta.pictures.push(pic1);
          }
          pic1.votesFor += survey.pic1Count;
          pic1.votesAgainst += survey.pic2Count;
          pic1.votesNoOpinion += survey.noOpinionCount;
          pic1.votesInvolved += survey.answered;
          let pic2 = meta.pictures.find(pic => pic.pictureId == survey.pic2_id);
          if(!pic2) {
            pic2 = new SurveyPicture(survey.pic2_id, survey.pic2);
            meta.pictures.push(pic2);
          }
          pic2.votesFor += survey.pic2Count;
          pic2.votesAgainst += survey.pic1Count;
          pic2.votesNoOpinion += survey.noOpinionCount;
          pic2.votesInvolved += survey.answered;
        });
        meta.pictures.sort((pic1, pic2) => pic2.votesFor - pic1.votesFor);
        meta.dirtyFlag = false;
      }
    });
  }
}
