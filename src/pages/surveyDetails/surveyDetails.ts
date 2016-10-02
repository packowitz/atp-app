import {NavParams, PopoverController} from "ionic-angular/index";
import {Survey} from "../../components/domain/survey.component";
import {Component} from "@angular/core";
import {Util} from "../../components/util.component";
import {SurveyService} from "../../providers/survey.service";
import {SurveyDetailsMenu} from "../../components/surveyDetailMenu.component";

@Component({
  templateUrl: 'surveyDetails.html'
})
export class SurveyDetailsPage {
  survey: Survey;
  countries: string[];
  showSummary: boolean = true;
  showStatistics: boolean = false;

  constructor(public navParams: NavParams,
              public surveyService: SurveyService,
              public popoverController: PopoverController) {
    this.survey = navParams.get('survey');
    if(this.survey.country != 'ALL') {
      this.countries = this.survey.country.split(",");
    } else {
      this.countries = [];
    }
    surveyService.loadSurveyDetails(this.survey);
  }

  showOptions(event: Event) {
    let popover = this.popoverController.create(SurveyDetailsMenu, {
      survey: this.survey,
      callbacks: {
        refresh: () => {this.surveyService.loadSurveyDetails(this.survey)},
        tweak: () => {alert("You can start an ATP with the same pictures but different criterias. Will come later.");},
        delete: () => {alert("Deleting an ATP will come later");}
      }
    });

    popover.present({
      ev: event
    });
  }

  getTimeDiff() {
    return Util.getTimeDiff(this.survey.startedDate);
  }

  hasAnswerOfCountry(country: string): boolean {
    let a = this.survey.answers.filter(answer => answer.country == country);
    console.log("found " + a.length + " answers in " + country);
    return a.length > 0;
  }
}
