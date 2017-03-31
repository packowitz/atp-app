import {Component, ViewChild} from "@angular/core";
import {NavController, MenuController, AlertController, Slides} from "ionic-angular";
import {Model} from "../../providers/services/model.service";
import {AuthService} from "../../providers/services/auth.service";
import {LoadingComponent} from "../loading/loading.component";
import {LocalStorage} from "../../providers/services/localStorage.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {EmailValidators} from "../../providers/validators/email.validator";

/**
 * Welcome page
 * Registers or logins in user and issues a token for API authentication
 */

@Component({
  templateUrl: 'welcome.component.html'
})
export class WelcomeComponent {
  @ViewChild(Slides) slides: Slides;
  email: string;
  password: string;
  deviceHeight: number = 100;
  loginForm: FormGroup;

  constructor(public nav: NavController,
              public menu: MenuController,
              public model: Model,
              public authService: AuthService,
              public localStorage: LocalStorage,
              public alertController: AlertController,
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
        this.nav.setRoot(LoadingComponent);
      }
    );
  }

  slideNext() {
    this.slides.slideNext();
  }

  login() {
    this.localStorage.clearStorage();
    this.authService.login(this.email, this.password).subscribe(data => {
      this.model.user = data.user;
      this.localStorage.setToken(data.token);
      this.nav.setRoot(LoadingComponent);
    });
  }

  forgotPassword() {
    this.alertController.create({
      title: 'Reset password',
      message: "Enter your email address you registered with ATP",
      inputs: [
        {
          name: 'email',
          placeholder: 'Your email address'
        },
      ],
      buttons: [
        {text: 'Cancel'},
        {text: 'Send',
          handler: data => {
            this.authService.requestNewPassword(data.email).subscribe(() => {
              this.alertController.create({
                title: 'Check your email',
                message: 'Please check your inbox for your new password. Please change that as soon as you are logged in.',
                buttons: [{text: 'OK'}]
              }).present();
            });
          }
        }
      ]
    }).present();
  }
}
