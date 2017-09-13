import {Survey} from "./survey";
export class MetaSurvey {
  ids: number[];
  groupId: number;
  multiPicture: boolean;
  status: string;
  startedDate: string;
  answered: number;
  title: string;
  age_1: boolean;
  age_2: boolean;
  age_3: boolean;
  age_4: boolean;
  age_5: boolean;
  age_6: boolean;
  age_7: boolean;
  age_8: boolean;
  age_9: boolean;
  countries: string;
  male: boolean;
  female: boolean;

  surveys: Survey[];
  pictures: SurveyPicture[];

  dirtyFlag: boolean;


  constructor(survey: Survey) {
    this.surveys = [survey];
    this.ids = [survey.id];
    this.groupId = survey.groupId;
    this.multiPicture = survey.multiPicture;
    this.status = survey.startedDate;
    this.startedDate = survey.startedDate;
    this.title = survey.title;
    this.age_1 = survey.age_1;
    this.age_2 = survey.age_2;
    this.age_3 = survey.age_3;
    this.age_4 = survey.age_4;
    this.age_5 = survey.age_5;
    this.age_6 = survey.age_6;
    this.age_7 = survey.age_7;
    this.age_8 = survey.age_8;
    this.age_9 = survey.age_9;
    this.countries = survey.countries;
    this.male = survey.male;
    this.female = survey.female;
    this.dirtyFlag = true;
  }
}

export class SurveyPicture {
  pictureId: number;
  picture: string;
  votesFor: number = 0;
  votesAgainst: number = 0;
  votesNoOpinion: number = 0;
  votesInvolved: number = 0;


  constructor(pictureId: number, picture: string) {
    this.pictureId = pictureId;
    this.picture = picture;
  }
}
