import {Loading, Tabs, AlertController} from "ionic-angular";
import {SurveyService} from "../../providers/survey.service";
import {Survey} from "../../components/domain/survey.component";
import {Messages} from "../../components/messages.component";
import {Component} from "@angular/core";
import {Model} from "../../components/model.component";
import {NotificationService} from "../../providers/notification.service";

@Component({
  templateUrl: 'survey.html'
})
export class SurveyPage {
  picSize: number;
  survey: Survey;
  enabled: boolean = false;
  showTitle: boolean = false;
  loading: Loading;

  constructor(public surveyService: SurveyService,
              public tabs: Tabs,
              public notificationService: NotificationService,
              public alertController: AlertController) {
    this.loadNextSurvey();
  }

  loadNextSurvey() {
    this.surveyService.getSurveyToAnswer().subscribe(data => {
      this.showSurvey(data);
    });
  }

  ngOnInit() {
    setTimeout(() => {
      let maxWidht = window.innerWidth - 10;
      let maxHeight = (document.getElementById('survey-content').offsetHeight - 2) / 2;
      this.picSize = Math.min(maxWidht, maxHeight);
      console.log("picSize=" + this.picSize + " maxWidth=" + maxWidht + " maxHeight=" + maxHeight);
    }, 200);
  }

  showSurvey(survey: Survey) {
    this.survey = survey;
    if(survey.title) {
      this.showTitle = true;
      setTimeout(() => this.showTitle = false, 1500);
    }
    this.enabled = false;
    setTimeout(() => this.enabled = true, survey.title? 3500 : 2000);
  }

  goHome() {
    this.tabs.select(Model.MainTab);
  }

  reportAbuse() {
    this.alertController.create({
      title: 'Report Abuse',
      message: "Abuse means that you think that these pictures show <strong>illegal</strong> or <strong>illegitimate</strong> content.<br/>If you just don't have a meaning on these picture then please press 'skip'.",
      buttons: [
        {text: 'Cancel'},
        {text: 'Report Abuse', handler: () => this.selectPicture(3)}
      ]
    }).present();
  }

  selectPicture(picNr: number) {
    if(this.enabled) {
      this.surveyService.postResult(this.survey, picNr).subscribe(data => {
        this.showSurvey(data);
      });
    } else {
      this.notificationService.showToast({
        message: Messages.getTooFastMsg(),
        duration: 1000
      });
    }
  }
}
