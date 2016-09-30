import {Component, Input} from "@angular/core";
import {Survey} from "./domain/survey.component";
import {NavController} from "ionic-angular/index";
import {StartSurveyPage} from "../pages/startSurvey/startSurvey";
import {SurveyDetailsPage} from "../pages/surveyDetails/surveyDetails";
import {Util} from "./util.component";

@Component({
  selector: 'survey-list',
  templateUrl: 'surveyList.html'
})
export class SurveyListComponent {
  @Input()
  surveys: Survey[];
  @Input()
  surveyCount: number;

  constructor(public nav: NavController) {}

  getTimeDiff(survey: Survey) {
    return Util.getTimeDiff(survey.startedDate);
  }

  gotoStartSurvey() {
    this.nav.push(StartSurveyPage);
  }

  openSurveyDetails(survey: Survey) {
    this.nav.push(SurveyDetailsPage, {survey: survey});
  }
}
