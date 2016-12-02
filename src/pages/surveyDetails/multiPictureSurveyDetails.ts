import {NavParams, PopoverController, AlertController, NavController} from "ionic-angular/index";
import {Component} from "@angular/core";
import {Util} from "../../components/util.component";
import {SurveyService} from "../../providers/survey.service";
import {SurveyDetailsMenu} from "../../components/surveyDetailMenu.component";
import {Model} from "../../components/model.component";
import {NotificationService} from "../../providers/notification.service";
import {LocalStorage} from "../../providers/localStorage.component";
import {MetaSurvey, SurveyPicture} from "../../providers/domain/surveyMeta";

@Component({
  templateUrl: 'multiPictureSurveyDetails.html'
})
export class MultiPictureSurveyDetailsPage {
  meta: MetaSurvey;
  countries: string[];

  pictureDetailIds: number[] = [];

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
      showRefresh: this.meta.status != 'FINISHED',
      showDelete: true,
      callbacks: {
        refresh: () => {
        },
        delete: () => {
        }
      }
    });

    popover.present({
      ev: event
    });
  }

  toggleShowDetails(picture: SurveyPicture) {
    let idx = this.pictureDetailIds.indexOf(picture.pictureId);
    if(idx == -1) {
      this.pictureDetailIds.push(picture.pictureId);
    } else {
      this.pictureDetailIds.splice(idx, 1);
    }
  }

  isShowDetails(picture: SurveyPicture): boolean {
    return this.pictureDetailIds.indexOf(picture.pictureId) != -1;
  }

  getTimeDiff() {
    return Util.getTimeDiff(this.meta.startedDate);
  }
}
