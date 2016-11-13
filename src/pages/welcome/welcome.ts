import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Model} from "../../components/model.component";
import {AuthService} from "../../providers/auth.service";
import {LoadingPage} from "../loading/loading";
import {Storage} from "@ionic/storage";

/**
 * Welcome page
 * Registers or logins in user and issues a token for API authentication
 */

@Component({
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  sliderOptions = {pager: true};
  username: string;
  password: string;
  deviceHeight: number = 100;

  constructor(public nav: NavController,
              public model: Model,
              public authService: AuthService,
              public storage: Storage) {
    this.deviceHeight = window.innerHeight;
  }

  startATP() {
    this.authService.registerNewUser().subscribe(
      data => {
        this.model.token = data.token;
        this.model.user = data.user;
        this.storage.set('atpToken', data.token).then(() => this.nav.setRoot(LoadingPage));
      }
    );
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(data => {
      this.model.token = data.token;
      this.model.user = data.user;
      this.storage.set('atpToken', data.token).then(() => this.nav.setRoot(LoadingPage));
    });
  }

  forgotPassword() {
    window.open("https://atp-pacworx.rhcloud.com/atp.html", "_system");
  }
}
