import {NavParams, PopoverController, AlertController, NavController} from "ionic-angular";
import {Component} from "@angular/core";
import {Util} from "../../providers/domain/util";
import {SurveyService} from "../../providers/services/survey.service";
import {SurveyDetailsMenuComponent} from "../../components/surveyDetailMenu.component";
import {Model} from "../../providers/services/model.service";
import {NotificationService} from "../../providers/services/notification.service";
import {LocalStorage} from "../../providers/services/localStorage.service";
import {MetaSurvey, SurveyPicture} from "../../providers/domain/surveyMeta";

@Component({
  templateUrl: 'multiPictureSurveyDetails.component.html'
})
export class MultiPictureSurveyDetailsComponent {
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
    let popover = this.popoverController.create(SurveyDetailsMenuComponent, {
      showRefresh: this.meta.status != 'FINISHED',
      showDelete: true,
      callbacks: {
        refresh: () => {
          this.surveyService.updateMySurveys("updating your ATPs");
        },
        delete: () => {
          this.alertController.create({
            title: 'Delete this series of ATP?',
            message: 'Are you sure to delete this ATP? This action is permanent. This is ATP depending on multiple ATPs. All of them are getting deleted.',
            buttons: [
              {text: 'Cancel'},
              {
                text: 'Delete',
                handler: () => {
                  this.surveyService.deleteSurveyGroup(this.meta).subscribe(() => {
                    this.localStorage.deleteSurveyByGroupId(this.meta.groupId);
                    this.notificationService.showToast({
                      message: 'ATPs deleted',
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
