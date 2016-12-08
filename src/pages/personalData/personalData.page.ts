import {Component} from "@angular/core";
import {NavController, ViewController, PopoverController} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {Country} from "../../providers/domain/country";
import {CountryService} from "../../providers/country.service";
import {CountrySelection} from "../../components/countrySelection.component";
import {AuthService} from "../../providers/auth.service";
import {NotificationService} from "../../providers/notification.service";

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

  constructor(public nav: NavController,
              public model: Model,
              public countryService: CountryService,
              public authService: AuthService,
              public notificationService: NotificationService,
              public viewCtrl: ViewController,
              public popoverController: PopoverController) {
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
    if(this.model.user.yearOfBirth !== this.yearOfBirth) {
      return false;
    }
    if(this.model.user.male !== this.male) {
      return false;
    }
    if(this.country && this.model.user.country != this.country.alpha3) {
      return false;
    }
    return true;
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
      let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      return EMAIL_REGEXP.test(this.newEmail);
    } else {
      return false;
    }
  }

  submitSetEmail() {
    this.authService.secureAccount(this.newEmail, this.newPassword).subscribe(
      data => {
        this.model.user = data;
        this.notificationService.showToast({
          message: 'Account secured',
          duration: 2000,
          showCloseButton: true,
          closeButtonText: 'OK'
        });
      }
    );
  }
}
