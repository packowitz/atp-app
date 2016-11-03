import {NavParams, PopoverController, AlertController, NavController} from "ionic-angular/index";
import {Survey} from "../../components/domain/survey.component";
import {Component} from "@angular/core";
import {Util} from "../../components/util.component";
import {SurveyService} from "../../providers/survey.service";
import {SurveyDetailsMenu} from "../../components/surveyDetailMenu.component";
import {Model} from "../../components/model.component";
import {NotificationService} from "../../providers/notification.service";

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
              public popoverController: PopoverController,
              public alertController: AlertController,
              public nav: NavController,
              public model: Model,
              public notificationService: NotificationService) {
    this.survey = navParams.get('survey');
    if(this.survey.countries != 'ALL') {
      this.countries = this.survey.countries.split(",");
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
        delete: () => {
          this.alertController.create({
            title: 'Delete this ATP?',
            message: 'Are you sure to delete this ATP? This action is permanent.',
            buttons: [
              {text: 'Cancel'},
              {
                text: 'Delete',
                handler: () => {
                  this.surveyService.deleteSurvey(this.survey).subscribe(() => {
                    this.model.surveyDeleted(this.survey);
                    this.notificationService.showToast({
                      message: 'ATP deleted',
                      duration: 3000,
                      showCloseButton: true,
                      closeButtonText: 'OK'
                    });
                    this.nav.pop();
                  });
                }
              }
            ]
          }).present();
        }
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
