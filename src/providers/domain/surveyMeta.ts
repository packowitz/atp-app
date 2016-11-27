import {Survey} from "./survey";
export class MetaSurvey {
  ids: number[];
  groupId: number;
  multiPicture: boolean;
  status: string;
  startedDate: string;
  answered: number;
  title: string;
  minAge: number;
  maxAge: number;
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
    this.minAge = survey.minAge;
    this.maxAge = survey.maxAge;
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
