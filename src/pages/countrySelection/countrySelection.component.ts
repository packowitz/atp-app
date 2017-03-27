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
  templateUrl: 'countrySelection.component.html'
})

export class CountrySelectionComponent {
  countries: Country[];
  selectedCountries: Country[] = [];

  multiSelection: boolean;

  constructor(public countryService: CountryService,
              public navParams: NavParams,
              public alertController: AlertController,
              public viewCtrl: ViewController) {
    this.loadCountries();

    // Handle multiple country or single country selection
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

    // Dismiss popover if we only want a single selection
    if (!this.multiSelection)
      this.submit();
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
    this.viewCtrl.dismiss(this.multiSelection
      ? this.selectedCountries
      : this.selectedCountries[0]
    );
  }
}
