import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular/index";
import {SurveyDetailsPage} from "../pages/surveyDetails/surveyDetails";
import {Util} from "./util.component";
import {MetaSurvey} from "../providers/domain/surveyMeta";
import {MultiPictureSurveyDetailsPage} from "../pages/surveyDetails/multiPictureSurveyDetails";

@Component({
  selector: 'survey-overview-bar',
  templateUrl: 'surveyOverviewBar.html'
})
export class SurveyOverviewBar {
  @Input()
  survey: MetaSurvey;

  constructor(public nav: NavController) {
  }

  getTimeDiff() {
    return Util.getTimeDiff(this.survey.startedDate);
  }

  openSurveyDetails() {
    if(this.survey.multiPicture) {
      this.nav.push(MultiPictureSurveyDetailsPage, {multiPictureSurvey: this.survey});
    } else {
      this.nav.push(SurveyDetailsPage, {survey: this.survey.surveys[0]});
    }
  }
}
