import {Component} from "@angular/core";
import {SurveyService} from "../../providers/services/survey.service";
import {Tabs} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {LocalStorage} from "../../providers/localStorage.component";

@Component({
  selector: 'my-surveys-page',
  templateUrl: 'mySurveys.html'
})
export class MySurveysPage {

  constructor(public tabs: Tabs,
              public localStorage: LocalStorage,
              public surveyService: SurveyService) {}

  ionViewDidEnter() {
    this.surveyService.updateMySurveys();
  }

  gotoStartSurvey() {
    this.tabs.select(Model.StartSurveyTab);
  }
}
