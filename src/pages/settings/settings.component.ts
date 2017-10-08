import {Component} from "@angular/core";
import {Model} from "../../providers/services/model.service";
import {ViewController, Platform} from "ionic-angular";
import {SettingsService} from "../../providers/services/settings.service";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'settings.component.html'
})
export class SettingsComponent {
  constructor(public model: Model,
              public settingsService: SettingsService,
              public viewCtrl: ViewController,
              public platform: Platform,
              public analytics: Analytics) {
  }

  ionViewDidEnter() {
    this.analytics.enterPage("Settings");
  }

  submitAtpAnswerable() {
    this.analytics.event("notification_answerable_" + this.model.notificationSettings.atpAnswerableEnabled ? "enabled" : "disabled", {page: "Settings"});
    this.settingsService.updateNotificationAtpAnswerable(this.model.notificationSettings.atpAnswerableEnabled).subscribe(
      data => this.model.notificationSettings.atpAnswerableEnabled = data.enabled
    );
  }

  submitTimeBetweenAnswerable() {
    this.analytics.event("notification_answerable_time_" + this.model.notificationSettings.hoursBetweenAnswerable, {page: "Settings"});
    this.settingsService.updateAnswerableBetweenTime(this.model.notificationSettings.hoursBetweenAnswerable).subscribe(
      data => this.model.notificationSettings.hoursBetweenAnswerable = data.hours
    );
  }

  submitAtpFinished() {
    this.analytics.event("notification_finished_" + this.model.notificationSettings.atpFinishedEnabled ? "enabled" : "disabled", {page: "Settings"});
    this.settingsService.updateNotificationAtpFinished(this.model.notificationSettings.atpFinishedEnabled).subscribe(
      data => this.model.notificationSettings.atpFinishedEnabled = data.enabled
    );
  }

  submitAnnouncement() {
    this.analytics.event("notification_announcement_" + this.model.notificationSettings.announcementEnabled ? "enabled" : "disabled", {page: "Settings"});
    this.settingsService.updateNotificationAnnouncement(this.model.notificationSettings.announcementEnabled).subscribe(
      data => this.model.notificationSettings.announcementEnabled = data.enabled
    );
  }

  submitFeedback() {
    this.analytics.event("notification_feedback_" + this.model.notificationSettings.feedbackEnabled ? "enabled" : "disabled", {page: "Settings"});
    this.settingsService.updateNotificationFeedback(this.model.notificationSettings.feedbackEnabled).subscribe(
      data => this.model.notificationSettings.feedbackEnabled = data.enabled
    );
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
