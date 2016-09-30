import {NavParams, ViewController, PopoverController} from "ionic-angular/index";
import {Survey} from "../../components/domain/survey.component";
import {Component} from "@angular/core";
import {Util} from "../../components/util.component";
import {SurveyService} from "../../providers/survey.service";

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

@Component({
  template: `
    <ion-list style="margin: 0;">
      <ion-item *ngIf="survey.status != 'FINISHED'" (click)="refresh()">
        <ion-icon name="refresh" item-left></ion-icon> Refresh
      </ion-item>
      <ion-item *ngIf="survey.status != 'ABUSE'" (click)="tweak()">
        <ion-icon name="share-alt" item-left></ion-icon> Tweak
      </ion-item>
      <ion-item class="text-danger" (click)="delete()">
        <ion-icon name="remove-circle" item-left></ion-icon> Delete
      </ion-item>
    </ion-list>
  `,
})
class SurveyDetailsMenu {
  survey: Survey;
  callbacks;

  constructor(public navParams: NavParams, public viewController: ViewController) {
    this.survey = navParams.get('survey');
    this.callbacks = navParams.get('callbacks')
  }

  refresh() {
    this.callbacks.refresh();
    this.viewController.dismiss();
  }

  tweak() {
    this.callbacks.tweak();
    this.viewController.dismiss();
  }

  delete() {
    this.callbacks.delete();
    this.viewController.dismiss();
  }
}
