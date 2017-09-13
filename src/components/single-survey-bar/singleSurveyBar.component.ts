import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {SurveyDetailsComponent} from "../../pages/surveyDetails/surveyDetails.component";
import {Util} from "../../providers/domain/util";

@Component({
  selector: 'single-survey-bar',
  templateUrl: 'singleSurveyBar.component.html'
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
  @Input()
  title: string;

  constructor(public nav: NavController) {
  }

  getTimeDiff() {
    return Util.getTimeDiff(this.startedDate);
  }

  openSurveyDetails() {
    if(this.surveyId) {
      this.nav.push(SurveyDetailsComponent, {surveyId: this.surveyId});
    }
  }
}
