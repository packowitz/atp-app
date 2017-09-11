import {Country} from "./country";
import {AgeRange} from "./ageRange";

export class SurveySettings {
  countries: Country[] = [];
  ageRanges: AgeRange[] = [];
  male: boolean;
  female: boolean;
}
