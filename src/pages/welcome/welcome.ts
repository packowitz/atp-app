import {Component} from "@angular/core";
import {NavController, MenuController} from "ionic-angular";
import {Model} from "../../components/model.component";
import {AuthService} from "../../providers/auth.service";
import {LoadingPage} from "../loading/loading";
import {LocalStorage} from "../../providers/localStorage.component";

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
              public menu: MenuController,
              public model: Model,
              public authService: AuthService,
              public localStorage: LocalStorage) {
    this.deviceHeight = window.innerHeight;
    this.menu.swipeEnable(false);
  }

  startATP() {
    this.authService.registerNewUser().subscribe(
      data => {
        this.model.user = data.user;
        this.localStorage.setToken(data.token);
        this.nav.setRoot(LoadingPage);
      }
    );
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(data => {
      this.model.user = data.user;
      this.localStorage.setToken(data.token);
      this.nav.setRoot(LoadingPage);
    });
  }

  forgotPassword() {
    window.open("https://atp-pacworx.rhcloud.com/atp.html", "_system");
  }
}
