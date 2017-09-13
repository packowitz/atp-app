import {NavParams, PopoverController, AlertController, NavController} from "ionic-angular";
import {Survey} from "../../providers/domain/survey";
import {Component} from "@angular/core";
import {Util} from "../../providers/domain/util";
import {SurveyService} from "../../providers/services/survey.service";
import {SurveyDetailsMenuComponent} from "../../components/surveyDetailMenu.component";
import {Model} from "../../providers/services/model.service";
import {NotificationService} from "../../providers/services/notification.service";
import {LocalStorage} from "../../providers/services/localStorage.service";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'surveyDetails.component.html'
})
export class SurveyDetailsComponent {
  survey: Survey;
  countries: string[];
  noAgeRestriction: boolean = true;
  ageDescription: string;
  statisticsExpand: boolean = false;
  summaryExpand: boolean = true;

  constructor(public navParams: NavParams,
              public surveyService: SurveyService,
              public popoverController: PopoverController,
              public alertController: AlertController,
              public nav: NavController,
              public model: Model,
              public localStorage: LocalStorage,
              public notificationService: NotificationService,
              public analytics: Analytics) {
    let surveyId = navParams.get('surveyId');
    this.survey = localStorage.getSurveyById(surveyId);
    this.noAgeRestriction = this.survey.age_1 && this.survey.age_2 && this.survey.age_3 && this.survey.age_4 && this.survey.age_5 && this.survey.age_6 && this.survey.age_7 && this.survey.age_8 && this.survey.age_9;
    if(!this.noAgeRestriction) {
      this.ageDescription = this.getAgeDescription();
    }
    if(this.survey.countries != 'ALL') {
      this.countries = this.survey.countries.split(",");
    } else {
      this.countries = [];
    }
    if(!this.survey.answers || this.survey.answered != this.survey.answers.length) {
      surveyService.loadSurveyDetails(this.survey);
    }
  }

  ionViewDidEnter() {
    this.analytics.enterPage("AtpDetails");
  }

  toggleStatistics() {
    this.analytics.event("toggle_statistics", {page: "AtpDetails"});
    this.statisticsExpand = !this.statisticsExpand;
  }

  showOptions(event: Event) {
    this.analytics.event("show_options", {page: "AtpDetails"});
    let popover = this.popoverController.create(SurveyDetailsMenuComponent, {
      showRefresh: this.survey.status != 'FINISHED',
      showDelete: !this.survey.multiPicture,
      callbacks: {
        refresh: () => {
          this.analytics.event("refresh_atp", {page: "AtpDetails"});
          this.surveyService.loadSurveyDetails(this.survey);
        },
        delete: () => {
          this.analytics.event("show_delete_atp_alert", {page: "AtpDetails"});
          this.alertController.create({
            title: 'Delete this ATP?',
            message: 'Are you sure to delete this ATP? This action is permanent.',
            buttons: [
              {text: 'Cancel'},
              {
                text: 'Delete',
                handler: () => {
                  this.analytics.event("delete_atp", {page: "AtpDetails"});
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

  getAgeDescription(): string {
    let first: boolean = true;
    let desc = '';
    this.model.ageRanges.forEach(r => {
      if(this.survey['age_' + r.id]) {
        if(first) {
          first = false;
        } else {
          desc += ', ';
        }
        desc += r.name_plural;
      }
    });
    return desc;
  }

  getAgeName(ageRange: number): string {
    return '<span class="bold">' + this.model.ageRanges.find(r => r.id == ageRange).description + '</span>';
  }

  getCountryFlag(alpha3: string): string {
    return '<img src="assets/img/flags/' + alpha3 + '.png" class="flag larger">';
  }

  getGenderIcon(gender: string): string {
    return '<i class="bold fa fa-' + (gender == 'male' ? 'mars' : 'venus') + '"></i>';
  }

  hasAnswerOfCountry(country: string): boolean {
    let a = this.survey.answers.filter(answer => answer.country == country);
    console.log("found " + a.length + " answers in " + country);
    return a.length > 0;
  }
}
