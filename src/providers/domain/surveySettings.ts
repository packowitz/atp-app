import {Country} from "./country";

export class SurveySettings {
  countries: Country[] = [];
  minAge: number;
  maxAge: number;
  male: boolean;
  female: boolean;
}
