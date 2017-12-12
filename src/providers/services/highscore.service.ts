import {Injectable} from "@angular/core";
import {HighscoreUser} from "../domain/highscoreUser";
import {Observable} from "rxjs/Observable";
import {AtpHttp} from "./atpHttp.service";

@Injectable()
export class HighscoreService {

  constructor(public atpHttp: AtpHttp) {}

  getHighscoreGlobalWeek(): Observable<HighscoreUser[]> {
    return this.atpHttp.doGetBackground("/app/user/highscore/week");
  }

  getHighscoreLocalWeek(): Observable<HighscoreUser[]> {
    return this.atpHttp.doGetBackground("/app/user/highscore/week/local");
  }

  getHighscoreGlobalTotal(): Observable<HighscoreUser[]> {
    return this.atpHttp.doGetBackground("/app/user/highscore");
  }

  getHighscoreLocalTotal(): Observable<HighscoreUser[]> {
    return this.atpHttp.doGetBackground("/app/user/highscore/local");
  }
}
