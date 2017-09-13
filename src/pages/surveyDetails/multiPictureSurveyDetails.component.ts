import {NavParams, PopoverController, AlertController, NavController} from "ionic-angular";
import {Component} from "@angular/core";
import {Util} from "../../providers/domain/util";
import {SurveyService} from "../../providers/services/survey.service";
import {SurveyDetailsMenuComponent} from "../../components/surveyDetailMenu.component";
import {Model} from "../../providers/services/model.service";
import {NotificationService} from "../../providers/services/notification.service";
import {LocalStorage} from "../../providers/services/localStorage.service";
import {MetaSurvey, SurveyPicture} from "../../providers/domain/surveyMeta";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'multiPictureSurveyDetails.component.html'
})
export class MultiPictureSurveyDetailsComponent {
  meta: MetaSurvey;
  countries: string[];
  noAgeRestriction: boolean = true;
  ageDescription: string;

  pictureDetailIds: number[] = [];

  constructor(public navParams: NavParams,
              public surveyService: SurveyService,
              public popoverController: PopoverController,
              public alertController: AlertController,
              public nav: NavController,
              public model: Model,
              public localStorage: LocalStorage,
              public notificationService: NotificationService,
              public analytics: Analytics) {
    this.meta = navParams.get('multiPictureSurvey');
    this.noAgeRestriction = this.meta.age_1 && this.meta.age_2 && this.meta.age_3 && this.meta.age_4 && this.meta.age_5 && this.meta.age_6 && this.meta.age_7 && this.meta.age_8 && this.meta.age_9;
    if(!this.noAgeRestriction) {
      this.ageDescription = this.getAgeDescription();
    }
    if(this.meta.countries != 'ALL') {
      this.countries = this.meta.countries.split(",");
    } else {
      this.countries = [];
    }
  }

  ionViewDidEnter() {
    this.analytics.enterPage("MultiPictureAtpDetails");
  }

  showOptions(event: Event) {
    this.analytics.event("show_options", {page: "MultiPictureAtpDetails"});
    let popover = this.popoverController.create(SurveyDetailsMenuComponent, {
      showRefresh: this.meta.status != 'FINISHED',
      showDelete: true,
      callbacks: {
        refresh: () => {
          this.analytics.event("refresh_atp", {page: "MultiPictureAtpDetails"});
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
                  this.analytics.event("delete_atp", {page: "MultiPictureAtpDetails"});
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

  getAgeDescription(): string {
    let first: boolean = true;
    let desc = '';
    this.model.ageRanges.forEach(r => {
      if(this.meta['age_' + r.id]) {
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

  toggleShowDetails(picture: SurveyPicture) {
    this.analytics.event("toggle_details", {page: "MultiPictureAtpDetails"});
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
