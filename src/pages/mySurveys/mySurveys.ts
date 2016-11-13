import {Component} from "@angular/core";
import {SurveyService} from "../../providers/survey.service";
import {Tabs} from "ionic-angular/index";
import {Model} from "../../components/model.component";

@Component({
  selector: 'my-surveys-page',
  templateUrl: 'mySurveys.html'
})
export class MySurveysPage {
  selection: string = "current";
  currentLoaded: boolean = false;
  archivedLoaded: boolean = false;

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

  loadArchived() {
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
