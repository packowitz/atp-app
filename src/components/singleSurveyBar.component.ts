import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular/index";
import {SurveyDetailsPage} from "../pages/surveyDetails/surveyDetails";
import {Util} from "./util.component";

@Component({
  selector: 'single-survey-bar',
  templateUrl: 'singleSurveyBar.html'
})
export class SingleSurveyBar {
  @Input()
  startedDate: string;
  @Input()
  surveyId: number;
  @Input()
  leftPic: string;
  @Input()
  rightPic: string;
  @Input()
  leftPicCount: number;
  @Input()
  rightPicCount: number;
  @Input()
  noOpinionCount: number;
  @Input()
  answered: number;
  @Input()
  status: string;

  constructor(public nav: NavController) {
  }

  getTimeDiff() {
    return Util.getTimeDiff(this.startedDate);
  }

  openSurveyDetails() {
    if(this.surveyId) {
      this.nav.push(SurveyDetailsPage, {surveyId: this.surveyId});
    }
  }
}
