import {Component} from "@angular/core";
import {Country} from "../../providers/domain/country";
import {Model} from "../../providers/services/model.service";
import {Analytics} from "../../providers/services/analytics.service";
import {AuthService} from "../../providers/services/auth.service";
import {ViewController, ModalController} from "ionic-angular";
import {CountrySelectionComponent} from "../countrySelection/countrySelection.component";

@Component({
  templateUrl: 'userdata.popover.html'
})
export class UserdataPopover {

  showYOB: boolean = false;
  showGender: boolean = false;
  showCountry: boolean = false;

  minYear: string;
  maxYear: string;
  yearString: string;
  country: Country;

  constructor(public model: Model,
              public analytics: Analytics,
              public authService: AuthService,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController) {
    let currentYear: number = new Date().getFullYear();
    this.minYear = String(currentYear - 99);
    this.maxYear = String(currentYear - 5);
    this.setInputToShow();
  }

  ionViewDidEnter() {
    this.analytics.enterPage("UserdataPopup");
  }

  setInputToShow() {
    if (!this.model.user.yearOfBirth) {
      this.showYOB = true;
      this.showGender = false;
      this.showCountry = false;
    } else {
      this.showYOB = false;
      if (this.model.user.male !== true && this.model.user.male !== false) {
        this.showGender = true;
        this.showCountry = false;
      } else {
        this.showGender = false;
        if (!this.model.user.country) {
          this.showCountry = true;
        } else {
          this.viewCtrl.dismiss();
        }
      }
    }
  }

  yearChanged() {
    this.analytics.event("yob_changed", {page: "UserdataPopup"});
    this.authService.postYearOfBirth(Number(this.yearString)).subscribe(
      data => {
        this.model.user = data;
        this.setInputToShow();
      }
    );
  }

  genderChanged(male: boolean) {
    this.analytics.event("gender_changed", {page: "UserdataPopup"});
    this.authService.postGender(male).subscribe(
      data => {
        this.model.user = data;
        this.setInputToShow();
      }
    );
  }

  showCountrySelection() {
    let countrySelection = this.modalCtrl.create(CountrySelectionComponent, {country: this.country});
    countrySelection.present();

    countrySelection.onDidDismiss(data => {
      if (data) {
        this.analytics.event("country_changed", {page: "UserdataPopup"});
        this.authService.postCountry(data.alpha3).subscribe(
          data => {
            this.model.user = data;
            this.setInputToShow();
          }
        );
      }
    });
  }
}
