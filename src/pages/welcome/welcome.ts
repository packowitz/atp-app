import {Component} from "@angular/core";
import {NavController, MenuController} from "ionic-angular";
import {Model} from "../../components/model.component";
import {AuthService} from "../../providers/services/auth.service";
import {LoadingPage} from "../loading/loading";
import {LocalStorage} from "../../providers/localStorage.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {EmailValidators} from "../../providers/validators/email.validator";

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
  loginForm: FormGroup;

  constructor(public nav: NavController,
              public menu: MenuController,
              public model: Model,
              public authService: AuthService,
              public localStorage: LocalStorage,
              public fb: FormBuilder) {
    this.deviceHeight = window.innerHeight;
    this.menu.swipeEnable(false);

    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, EmailValidators.valid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
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
