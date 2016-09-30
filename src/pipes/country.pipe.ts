import {PipeTransform, Pipe} from "@angular/core";
import {Answer} from "../components/domain/answer.component";

export class CountryPipeResult {
  alpha3: string;
  pic1: number = 0;
  pic2: number = 0;
  noOpinion: number = 0;

  constructor(alpha3: string) {
    this.alpha3 = alpha3;
  }
}

@Pipe({name: 'country'})
export class CountryPipe implements PipeTransform {
  transform(value: Answer[], args:string[]) : CountryPipeResult[] {
    var countries = {};
    value.forEach(answer => {
      let country = answer.country;
      countries[country] = countries[country] ? countries[country] : new CountryPipeResult(country);
      if(answer.answer == 1) {
        countries[country].pic1 ++;
      } else if (answer.answer == 2) {
        countries[country].pic2 ++;
      } else {
        countries[country].noOpinion ++;
      }
    });
    return Object.keys(countries).map(function (key) {
      return countries[key]
    });
  }
}
