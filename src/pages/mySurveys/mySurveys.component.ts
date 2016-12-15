import {Component} from "@angular/core";
import {SurveyService} from "../../providers/services/survey.service";
import {Tabs} from "ionic-angular/index";
import {Model} from "../../providers/services/model.service";
import {LocalStorage} from "../../providers/services/localStorage.service";

@Component({
  selector: 'my-surveys-page',
  templateUrl: 'mySurveys.component.html'
})
export class MySurveyComponent {

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
