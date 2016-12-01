import {NavParams, PopoverController, AlertController, NavController} from "ionic-angular/index";
import {Component} from "@angular/core";
import {Util} from "../../components/util.component";
import {SurveyService} from "../../providers/survey.service";
import {SurveyDetailsMenu} from "../../components/surveyDetailMenu.component";
import {Model} from "../../components/model.component";
import {NotificationService} from "../../providers/notification.service";
import {LocalStorage} from "../../providers/localStorage.component";
import {MetaSurvey} from "../../providers/domain/surveyMeta";

@Component({
  templateUrl: 'multiPictureSurveyDetails.html'
})
export class MultiPictureSurveyDetailsPage {
  meta: MetaSurvey;
  countries: string[];

  constructor(public navParams: NavParams,
              public surveyService: SurveyService,
              public popoverController: PopoverController,
              public alertController: AlertController,
              public nav: NavController,
              public model: Model,
              public localStorage: LocalStorage,
              public notificationService: NotificationService) {
    this.meta = navParams.get('multiPictureSurvey');
    if(this.meta.countries != 'ALL') {
      this.countries = this.meta.countries.split(",");
    } else {
      this.countries = [];
    }
  }

  showOptions(event: Event) {
    let popover = this.popoverController.create(SurveyDetailsMenu, {
      survey: this.meta,
      callbacks: {
        refresh: () => {
        },
        tweak: () => {
          alert("You can start an ATP with the same pictures but different criterias. Will come later.");
        },
        delete: () => {
        }
      }
    });

    popover.present({
      ev: event
    });
  }

  getTimeDiff() {
    return Util.getTimeDiff(this.meta.startedDate);
  }
}
