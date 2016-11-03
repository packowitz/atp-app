import {Component} from "@angular/core";
import {SurveyService} from "../../providers/survey.service";
import {Survey} from "../../components/domain/survey.component";
import {Tabs} from "ionic-angular/index";
import {Model} from "../../components/model.component";

@Component({
  templateUrl: 'mySurveys.html'
})
export class MySurveysPage {
  selection: string = "current";
  currentLoaded: boolean = false;
  currentSurveys: Survey[];
  archivedLoaded: boolean = false;
  archivedSurveys: Survey[];

  constructor(public tabs: Tabs,
              public model: Model,
              public surveyService: SurveyService) {}

  ionViewDidEnter() {
    if(!this.currentLoaded) {
      this.loadCurrentSurveys();
    } else {
      this.updateCurrentSurveys();
    }
  }

  ionChange() {
    if(!this.archivedLoaded) {
      this.loadArchivedSurveys();
    }
  }

  loadCurrentSurveys() {
    this.surveyService.getCurrentSurveyList().subscribe(surveys => {
      this.model.surveyList = surveys;
      this.currentLoaded = true;
    });
  }

  updateCurrentSurveys() {
    this.model.surveyList.forEach(survey => {
      if(survey.status != 'FINISHED') {
        this.surveyService.updateSurvey(survey);
      }
    });
  }

  loadArchivedSurveys() {
    this.surveyService.getArchivedSurveyList().subscribe(surveys => {
      this.model.surveyArchivedList = surveys;
      this.archivedLoaded = true;
    });
  }

  gotoStartSurvey() {
    this.tabs.select(Model.StartSurveyTab);
  }
}
