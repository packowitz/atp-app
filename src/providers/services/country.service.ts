import {Country} from "../domain/country";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {AtpHttp} from "./atpHttp.service";

@Injectable()
export class CountryService {

  countries: Country[];

  constructor(public atpHttp: AtpHttp) {}

  getCountries(): Observable<Country[]> {
    if(this.countries) {
      return Observable.create(obs => obs.next(this.countries));
    }
    // if(window.localStorage.getItem("countries")) {
    //   return Observable.create(obs => obs.next(JSON.parse(window.localStorage.getItem("countries"))));
    // }

    return this.atpHttp.doGetBackground<Country[]>("/country/list").map(data => {
      this.countries = data;
      // window.localStorage.setItem("countries", JSON.stringify(countries));
      return this.countries;
    })
  }
}
