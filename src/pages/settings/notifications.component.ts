import {Component} from "@angular/core";
import {Model} from "../../components/model.component";
import {AuthService} from "../../providers/auth.service";

@Component({
  selector: 'notifications',
  templateUrl: 'notifications.html'
})
export class NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  expanded: boolean = true;

  constructor(public model: Model,
              public authService: AuthService) {
    this.enabled = model.user.notifications;
    this.soundEnabled = model.user.notificationsSound;
    this.vibrationEnabled = model.user.notificationsVibration;
  }

  dataUnchanged(): boolean {
    return this.model.user.notifications == this.enabled &&
      this.model.user.notificationsSound == this.soundEnabled &&
      this.model.user.notificationsVibration == this.vibrationEnabled;
  }

  doSubmit() {
    this.authService.postNotification(this.enabled, this.soundEnabled, this.vibrationEnabled).subscribe(data => this.model.user = data);
  }
}
