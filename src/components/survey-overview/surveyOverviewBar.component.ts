import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular/index";
import {SurveyDetailsComponent} from "../../pages/surveyDetails/surveyDetails.component";
import {Util} from "../../providers/domain/util";
import {MetaSurvey} from "../../providers/domain/surveyMeta";
import {MultiPictureSurveyDetailsComponent} from "../../pages/surveyDetails/multiPictureSurveyDetails.component";

@Component({
  selector: 'survey-overview-bar',
  templateUrl: 'surveyOverviewBar.component.html'
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
      this.nav.push(MultiPictureSurveyDetailsComponent, {multiPictureSurvey: this.survey});
    } else {
      this.nav.push(SurveyDetailsComponent, {survey: this.survey.surveys[0]});
    }
  }
}
