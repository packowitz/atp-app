import {Component} from "@angular/core";
import {NavController, ViewController, PopoverController} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {Country} from "../../providers/domain/country";
import {CountryService} from "../../providers/country.service";
import {CountrySelection} from "../../components/countrySelection.component";
import {AuthService} from "../../providers/auth.service";

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

  constructor(public nav: NavController,
              public model: Model,
              public countryService: CountryService,
              public authService: AuthService,
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
    return this.model.user.yearOfBirth == this.yearOfBirth &&
      this.model.user.male == this.male &&
      this.model.user.country == this.country.alpha3;
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
}
