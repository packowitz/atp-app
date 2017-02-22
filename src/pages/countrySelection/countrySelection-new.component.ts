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
    <ion-title>{{multiSelection ? 'Select countries' : 'Your country'}}</ion-title>

    <ion-buttons start>
      <button ion-button icon-only (click)="submit()"><ion-icon name="close"></ion-icon></button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-searchbar (ionInput)="searchCountries($event)"></ion-searchbar>
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
    .searchbar-md {
      padding: 0;
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
  selectedCountries: Country[] = [];

  multiSelection: boolean;

  constructor(public countryService: CountryService,
              public navParams: NavParams,
              public alertController: AlertController,
              public viewCtrl: ViewController) {
    this.loadCountries();

    // Either push or
    if (navParams.get('selectedCountries')) {
      this.selectedCountries = navParams.get('selectedCountries');

      this.multiSelection = true;
    } else if (navParams.get('country')) {
      this.selectedCountries.push(navParams.get('country'));

      this.multiSelection = false;
    }
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
      if (!this.multiSelection) {
        this.selectedCountries = [];
      }

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

  searchCountries(ev: any) {
    // Reset items back to all of the items
    this.loadCountries();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.countries = this.countries.filter((country) => {
        return (country.nameEng.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  /**
   * Submit selected countries if multiple selection is enabled otherwise just submit the first selected country
   */
  submit() {
    this.viewCtrl.dismiss(this.multiSelection ? this.selectedCountries : this.selectedCountries[0]);
  }
}
