import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Model} from "../../components/model.component";
import {AuthService} from "../../providers/auth.service";
import {LoadingPage} from "../loading/loading";
import {Storage} from "@ionic/storage";

@Component({
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  showLogin: boolean = false;
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

  toggleShowLogin() {
    console.log(this.username + " - " + this.password);
    this.showLogin = !this.showLogin;
  }

  startATP() {
    this.authService.registerNewUser().subscribe(
      data => {
        this.model.token = data.token;
        this.model.user = data.user;
        this.storage.set('token', data.token).then(() => this.nav.setRoot(LoadingPage));
      }
    );
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(data => {
      this.model.token = data.token;
      this.model.user = data.user;
      this.storage.set('token', data.token).then(() => this.nav.setRoot(LoadingPage));
    });
  }

  forgotPassword() {
    window.open("https://atp-pacworx.rhcloud.com/atp.html", "_system");
  }

}
