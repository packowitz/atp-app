import {Component} from "@angular/core";
import {NavController, ViewController, PopoverController, AlertController} from "ionic-angular";
import {Model} from "../../components/model.component";
import {Country} from "../../providers/domain/country";
import {CountryService} from "../../providers/services/country.service";
import {CountrySelection} from "../../components/countrySelection.component";
import {AuthService} from "../../providers/services/auth.service";
import {NotificationService} from "../../providers/services/notification.service";
import {Util} from "../../components/util.component";

@Component({
  templateUrl: 'personalData.page.html'
})
export class PersonalDataPage {
  minYear: string;
  maxYear: string;
  yearOfBirth: number;
  yearString: string;
  male: boolean;
  country: Country;

  newUsername: string = '';

  newEmail: string;
  newPassword: string;
  newPasswordRepeat: string;

  changeEmail: string;
  changeEmailPassword: string;

  changePasswordOld: string;
  changePasswordNew: string;
  changePasswordNewRepeat: string;

  constructor(public nav: NavController,
              public model: Model,
              public countryService: CountryService,
              public authService: AuthService,
              public notificationService: NotificationService,
              public viewCtrl: ViewController,
              public popoverController: PopoverController,
              public alertController: AlertController) {
    let currentYear: number = new Date().getFullYear();
    this.minYear = String(currentYear - 99);
    this.maxYear = String(currentYear - 5);
    this.yearOfBirth = model.user.yearOfBirth;
    if(this.yearOfBirth) {
      this.yearString = String(this.yearOfBirth);
    }
    this.male = model.user.male;
    if(model.user.country) {
      countryService.getCountries().subscribe(countries => {
        countries.forEach(c => {
          if(c.alpha3 == this.model.user.country) {
            this.country = c;
          }
        });
      });
    }
  }

  // Modal close
  close() {
    this.viewCtrl.dismiss();
  }

  yearChanged() {
    this.yearOfBirth = Number(this.yearString);
  }

  personalDataUnchanged(): boolean {
    if (this.model.user.yearOfBirth !== this.yearOfBirth) {
      return false;
    }
    if (this.model.user.male !== this.male) {
      return false;
    }

    return !(this.country && this.model.user.country != this.country.alpha3);
  }

  chooseCountry() {
    let countrySelection = this.popoverController.create(CountrySelection, {callback: country => {
      this.country = country;
      countrySelection.dismiss();
    }});
    countrySelection.present();
  }

  submitPersonalData() {
    this.authService.postPersonalData(this.yearOfBirth, this.male, this.country.alpha3).subscribe(data => this.model.user = data);
  }

  submitUsername() {
    this.authService.postUsername(this.newUsername).subscribe(
      data => {
        this.model.user = data;
        this.notificationService.showToast({
          message: 'Username set',
          duration: 2000,
          showCloseButton: true,
          closeButtonText: 'OK'
        });
      }
    );
  }

  setEmailValid(): boolean {
    if(this.newPassword && this.newPassword.length >= 8 && this.newPassword === this.newPasswordRepeat) {
      return Util.EMAIL_REGEXP.test(this.newEmail);
    } else {
      return false;
    }
  }

  submitSetEmail() {
    this.authService.secureAccount(this.newEmail, this.newPassword).subscribe(
      data => {
        this.model.user = data;
        this.showEmailSendAlert();
      }
    );
  }

  reloadStatus() {
    this.authService.getUser("Checking your status").subscribe(
      data => this.model.user = data
    );
  }

  resendConfirmationEmail() {
    this.authService.resendConfirmationEmail().subscribe(
      data => {
        this.model.user = data;
        this.showEmailSendAlert();
      }
    );
  }

  changeEmailValid(): boolean {
    if(this.changeEmailPassword && this.changeEmailPassword.length >= 8) {
      return Util.EMAIL_REGEXP.test(this.changeEmail);
    } else {
      return false;
    }
  }

  submitChangeEmail() {
    this.authService.postNewEmail(this.changeEmail, this.changeEmailPassword).subscribe(
      data => {
        this.model.user = data;
        this.changeEmail = '';
        this.changeEmailPassword = '';
        this.showEmailSendAlert();
      }
    );
  }

  changePasswordValid(): boolean {
    return this.changePasswordOld && this.changePasswordNew && this.changePasswordNew.length >= 8 && this.changePasswordNew === this.changePasswordNewRepeat;
  }

  submitChangePassword() {
    this.authService.postNewPassword(this.changePasswordOld, this.changePasswordNew).subscribe(
      data => {
        this.model.user = data;
        this.changePasswordOld = '';
        this.changePasswordNew = '';
        this.changePasswordNewRepeat = '';
        this.notificationService.showToast({
          message: 'Password changed',
          duration: 2000,
          showCloseButton: true,
          closeButtonText: 'OK'
        });
      }
    );
  }

  showEmailSendAlert() {
    this.alertController.create({
      title: 'Email send',
      message: 'Please check your inbox for the confirmation email and click the confirmation link.',
      buttons: [{text: 'OK'}]
    }).present();
  }
}
