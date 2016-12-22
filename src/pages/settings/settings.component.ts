import {Component} from "@angular/core";
import {Model} from "../../providers/services/model.service";
import {ViewController} from "ionic-angular";
import {SettingsService} from "../../providers/services/settings.service";

@Component({
  templateUrl: 'settings.component.html'
})
export class SettingsComponent {
  constructor(public model: Model,
              public settingsService: SettingsService,
              public viewCtrl: ViewController) {
  }

  submitAtpAnswerable() {
    this.settingsService.updateNotificationAtpAnswerable(this.model.notificationSettings.atpAnswerableEnabled).subscribe(
      data => this.model.notificationSettings.atpAnswerableEnabled = data.enabled
    );
  }

  submitAtpFinished() {
    this.settingsService.updateNotificationAtpAnswerable(this.model.notificationSettings.atpFinishedEnabled).subscribe(
      data => this.model.notificationSettings.atpFinishedEnabled = data.enabled
    );
  }

  submitAnnouncement() {
    this.settingsService.updateNotificationAtpAnswerable(this.model.notificationSettings.announcementEnabled).subscribe(
      data => this.model.notificationSettings.announcementEnabled = data.enabled
    );
  }

  submitFeedback() {
    this.settingsService.updateNotificationAtpAnswerable(this.model.notificationSettings.feedbackEnabled).subscribe(
      data => this.model.notificationSettings.feedbackEnabled = data.enabled
    );
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
