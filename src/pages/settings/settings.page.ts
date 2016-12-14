import {Component} from "@angular/core";
import {Model} from "../../components/model.component";
import {ViewController} from "ionic-angular";
import {AuthService} from "../../providers/services/auth.service";

@Component({
  templateUrl: 'settings.page.html'
})
export class SettingsPage {
  constructor(public model: Model,
              public authService: AuthService,
              public viewCtrl: ViewController) {
  }

  submitNotificationSettings() {
    this.authService.postNotification(this.model.user.notifications, this.model.user.notificationsSound, this.model.user.notificationsVibration)
      .subscribe(data => this.model.user = data);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
