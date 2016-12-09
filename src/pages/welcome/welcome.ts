import {Component} from "@angular/core";
import {NavController, MenuController} from "ionic-angular";
import {Model} from "../../components/model.component";
import {AuthService} from "../../providers/services/auth.service";
import {LoadingPage} from "../loading/loading";
import {LocalStorage} from "../../providers/localStorage.component";
import {Util} from "../../components/util.component";

/**
 * Welcome page
 * Registers or logins in user and issues a token for API authentication
 */

@Component({
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  sliderOptions = {pager: true};
  email: string;
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
    this.localStorage.clearStorage();
    this.authService.registerNewUser().subscribe(
      data => {
        this.model.user = data.user;
        this.localStorage.setToken(data.token);
        this.nav.setRoot(LoadingPage);
      }
    );
  }

  isEmailValid(): boolean {
    if(this.email) {
      return Util.EMAIL_REGEXP.test(this.email);
    }
    return false;
  }

  login() {
    this.localStorage.clearStorage();
    this.authService.login(this.email, this.password).subscribe(data => {
      this.model.user = data.user;
      this.localStorage.setToken(data.token);
      this.nav.setRoot(LoadingPage);
    });
  }

  forgotPassword() {
    window.open("https://atp-pacworx.rhcloud.com/atp.html", "_system");
  }
}
