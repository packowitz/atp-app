import {NavParams, PopoverController, AlertController, NavController} from "ionic-angular";
import {Survey} from "../../providers/domain/survey";
import {Component} from "@angular/core";
import {Util} from "../../providers/domain/util";
import {SurveyService} from "../../providers/services/survey.service";
import {SurveyDetailsMenuComponent} from "../../components/surveyDetailMenu.component";
import {Model} from "../../providers/services/model.service";
import {NotificationService} from "../../providers/services/notification.service";
import {LocalStorage} from "../../providers/services/localStorage.service";

@Component({
  templateUrl: 'surveyDetails.component.html'
})
export class SurveyDetailsComponent {
  survey: Survey;
  countries: string[];
  statisticsExpand: boolean = false;
  summaryExpand: boolean = true;

  constructor(public navParams: NavParams,
              public surveyService: SurveyService,
              public popoverController: PopoverController,
              public alertController: AlertController,
              public nav: NavController,
              public model: Model,
              public localStorage: LocalStorage,
              public notificationService: NotificationService) {
    let surveyId = navParams.get('surveyId');
    this.survey = localStorage.getSurveyById(surveyId);
    if(this.survey.countries != 'ALL') {
      this.countries = this.survey.countries.split(",");
    } else {
      this.countries = [];
    }
    if(!this.survey.answers || this.survey.answered != this.survey.answers.length) {
      surveyService.loadSurveyDetails(this.survey);
    }
  }

  toggleExpands() {
    this.summaryExpand = !this.summaryExpand;
    this.statisticsExpand = !this.statisticsExpand;
  }

  showOptions(event: Event) {
    let popover = this.popoverController.create(SurveyDetailsMenuComponent, {
      showRefresh: this.survey.status != 'FINISHED',
      showDelete: !this.survey.multiPicture,
      callbacks: {
        refresh: () => {this.surveyService.loadSurveyDetails(this.survey)},
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
                    this.localStorage.deleteSurvey(this.survey);
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
