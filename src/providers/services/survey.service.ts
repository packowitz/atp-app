import {Injectable} from "@angular/core";
import {Survey} from "../domain/survey";
import {Observable} from "rxjs/Observable";
import {Messages} from "../domain/messages";
import {AtpHttp} from "./atpHttp.service";
import {LocalStorage} from "./localStorage.service";
import {MetaSurvey} from "../domain/surveyMeta";

export class SurveyListWithTimestamp {
  data: Survey[];
  timestamp: number;
}

export class IdListWithTimestamp {
  data: number[];
  timestamp: number;
}

@Injectable()
export class SurveyService {

  constructor(public atpHttp: AtpHttp, public localStorage: LocalStorage) {}

  postSurvey(survey: Survey, type: string, pictures: string[]): Observable<Survey[]> {
    let request = {survey: survey, type: type, pictures: pictures};
    return this.atpHttp.doPost("/app/survey/private", request, "Starting ATP");
  }

  getSurveyToAnswer(): Observable<Survey> {
    return this.atpHttp.doGet("/app/survey/answerable", "Loading ATP");
  }

  postResult(survey: Survey, result: number): Observable<Survey> {
    let resultObj = {
      surveyId: survey.id,
      answer: result
    };
    let loadingMessage: string = result == 3 ? "reporting abuse" : Messages.getAnsweredMsg();
    return this.atpHttp.doPost("/app/survey/result", resultObj, loadingMessage);
  }

  getMySurveyIdsBackground(): Observable<IdListWithTimestamp> {
    return this.atpHttp.doGetBackground("/app/survey/ids");
  }

  getUpdatesForMySurveysSince(timestamp: number, message?: string): Observable<SurveyListWithTimestamp> {
    if(message) {
      return this.atpHttp.doGet("/app/survey/updates/since/" + timestamp, message);
    } else {
      return this.atpHttp.doGetBackground("/app/survey/updates/since/" + timestamp);
    }
  }

  updateMySurveys(message?: string) {
    this.getUpdatesForMySurveysSince(this.localStorage.getUpdateTimestamp(), message).subscribe(
      data => {
        let unknownSurveys: number[] = this.localStorage.updateMySurveys(data);
        console.log("Updated " + data.data.length + " surveys");
        if(unknownSurveys.length > 0) {
          this.getMySurveysByIds(unknownSurveys).subscribe(
            data => {
              this.localStorage.addSurveys(data);
              console.log("Loaded " + data.length + " new surveys");
            }
          );
        }
      }
    );
  }

  getMySurveysByIds(ids: number[]): Observable<Survey[]> {
    let idString = ids.join(',');
    return this.atpHttp.doGetBackground("/app/survey/list/byids/" + idString);
  }

  loadSurveyDetails(survey: Survey) {
    this.atpHttp.doGet("/app/survey/details/" + survey.id, "Loading ATP details").subscribe(data => {
      survey.status = data.status;
      survey.answered = data.answered;
      survey.noOpinionCount = data.noOpinionCount;
      survey.pic1Count = data.pic1Count;
      survey.pic2Count = data.pic2Count;
      survey.answers = data.answers;
    });
  }

  deleteSurvey(survey: Survey): Observable<any> {
    return this.atpHttp.doDelete("/app/survey/" + survey.id, "Deleting ATP");
  }

  deleteSurveyGroup(meta: MetaSurvey): Observable<any> {
    return this.atpHttp.doDelete("/app/survey/group/" + meta.groupId, "Deleting ATP");
  }
}
