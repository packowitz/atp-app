import {Component} from "@angular/core";
import {CountryService} from "../../providers/services/country.service";
import {Country} from "../../providers/domain/country";
import {NavParams, AlertController, ViewController} from "ionic-angular";

/**
 * New country selection component
 * Will be replacing original once completed and gradually adapted throughout the app
 *
 * @author: Max Tuzzolino
 */

@Component({
  template: `
<ion-header>
  <ion-toolbar color="atp-blue-light">
    <ion-title>Select countries</ion-title>

    <ion-buttons start>
      <button ion-button icon-only (click)="viewCtrl.dismiss()"><ion-icon name="close"></ion-icon></button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-list class="country-selection">
    <ion-item *ngFor="let country of countries" (click)="toggleSelected(country)">
        <img src="assets/img/flags/{{country.alpha3}}.png" class="flag">{{country.nameEng}}
        
        <button *ngIf="isSelected(country)" class="add-button" ion-button icon-only clear item-right color="favorite">
          <ion-icon name="checkmark"></ion-icon>
        </button>
    </ion-item>
  </ion-list>
</ion-content>
<ion-footer>
  <ion-buttons end>
    <button ion-button clear (click)="submit()">Save</button>
  </ion-buttons>
</ion-footer>
`,
  styles: [`
    .country-selection{
        max-height: 60vh;
    }
    .add-button {
      width: 5rem;
    }
    .button-inner {
        justify-content: flex-start;
    }
    .flag {
        height: 1.2em;
        vertical-align: bottom;
        margin-right: 3vw;
        border: 1px black solid;
    }`]
})

export class CountrySelectionNewComponent {
  countries: Country[];
  selectedCountries: Country[];

  constructor(public countryService: CountryService,
              public navParams: NavParams,
              public alertController: AlertController,
              public viewCtrl: ViewController) {
    this.loadCountries();
    this.selectedCountries = navParams.get('selectedCountries');
  }

  /**
   * Determines if specified country is selected or not
   * @param country
   * @returns {boolean}
   */
  isSelected(country: Country): boolean {
    return this.selectedCountries.filter(c => {
        return (country.nameEng == c.nameEng);
      }).length > 0;
  }

  /**
   * Add/remove country from our selected countries list
   * @param country
   */
  toggleSelected(country: Country) {
    if (this.isSelected(country)) {
      this.selectedCountries = this.selectedCountries.filter(c => {
        return (country.nameEng != c.nameEng)
      });
    } else {
      this.selectedCountries.push(country);
    }
  }

  /**
   * Fetch fresh list of available countries from our API
   */
  loadCountries() {
    this.countryService.getCountries().subscribe(data => {
      this.countries = data;
    }, err => {
      this.alertController.create({
        title: 'Network Error',
        message: 'There was a network error!',
        buttons: [{
          text: 'Retry',
          handler: () => {
            this.loadCountries();
          }
        }]
      }).present();
    });
  }

  submit() {
    this.viewCtrl.dismiss(this.selectedCountries);
  }
}
