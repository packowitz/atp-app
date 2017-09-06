import {Component} from "@angular/core";
import {NavController, ViewController, AlertController, Platform, ModalController} from "ionic-angular";
import {Model} from "../../providers/services/model.service";
import {Country} from "../../providers/domain/country";
import {CountryService} from "../../providers/services/country.service";
import {AuthService} from "../../providers/services/auth.service";
import {NotificationService} from "../../providers/services/notification.service";
import {Util} from "../../providers/domain/util";
import {CountrySelectionComponent} from "../countrySelection/countrySelection.component";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'personalData.component.html'
})
export class PersonalDataComponent {
  ageRange: number;
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
              public modalCtrl: ModalController,
              public alertController: AlertController,
              public platform: Platform,
              public analytics: Analytics) {
    this.ageRange = model.user.ageRange;
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

  ionViewDidEnter() {
    this.analytics.enterPage("PersonalData");
  }

  // Modal close
  close() {
    this.viewCtrl.dismiss();
  }

  ageRangeChanged() {
    this.analytics.event("ageRange_changed", {page: "PersonalData"});
    this.authService.postAgeRange(this.ageRange).subscribe(data => this.model.user = data);
  }

  genderChanged(male: boolean) {
    this.analytics.event("gender_changed", {page: "PersonalData"});
    this.male = male;
    this.authService.postGender(this.male).subscribe(data => this.model.user = data);
  }

  showCountrySelection() {
    let countrySelection = this.modalCtrl.create(CountrySelectionComponent, {country: this.country});
    countrySelection.present();

    // Update selected countries
    countrySelection.onDidDismiss(data => {
      if (data && data != this.country) {
        this.analytics.event("country_changed", {page: "PersonalData"});
        this.country = data;
        this.authService.postCountry(this.country.alpha3).subscribe(data => this.model.user = data);
      }
    });
  }

  submitUsername() {
    this.analytics.event("send_username", {page: "PersonalData"});
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
    this.analytics.event("send_email", {page: "PersonalData"});
    this.authService.secureAccount(this.newEmail, this.newPassword).subscribe(
      data => {
        this.model.user = data;
        this.showEmailSendAlert();
      }
    );
  }

  reloadStatus() {
    this.analytics.event("reload_user_status", {page: "PersonalData"});
    this.authService.getUser("Checking your status").subscribe(
      data => this.model.user = data
    );
  }

  resendConfirmationEmail() {
    this.analytics.event("resend_confirmation_email", {page: "PersonalData"});
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
    this.analytics.event("send_changed_email", {page: "PersonalData"});
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
    this.analytics.event("send_changed_password", {page: "PersonalData"});
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
