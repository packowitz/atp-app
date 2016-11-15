import {Component} from "@angular/core";
import {HighscoreService} from "../../providers/highscore.service";
import {HighscoreUser} from "../../providers/domain/highscoreUser";

@Component({
  templateUrl: 'highscore.html'
})
export class HighscorePage {
  selection: string = "week";
  showWeekGlobal: boolean = true;
  showTotalGlobal: boolean = true;
  weekGlobalLoaded: boolean = false;
  weekLocalLoaded: boolean = false;
  highscoreWeekGlobal: HighscoreUser[] = [];
  highscoreWeekLocal: HighscoreUser[] = [];
  highscoreTotalGlobal: HighscoreUser[] = [];
  highscoreTotalLocal: HighscoreUser[] = [];
  totalGlobalLoaded: boolean = false;
  totalLocalLoaded: boolean = false;

  constructor(public highscoreService: HighscoreService) {}

  ionViewDidEnter() {
    this.loadHighscoreWeekGlobal();
  }

  switchWeekGlobalLocal() {
    this.showWeekGlobal = !this.showWeekGlobal;
    if(!this.showWeekGlobal && !this.weekLocalLoaded) {
      this.loadHighscoreWeekLocal();
    }
  }

  switchTotalGlobalLocal() {
    this.showTotalGlobal = !this.showTotalGlobal;
    if(!this.showTotalGlobal && !this.totalLocalLoaded) {
      this.loadHighscoreTotalLocal();
    }
  }

  ionChange() {
    if(!this.totalGlobalLoaded) {
      this.loadHighscoreTotalGlobal();
    }
  }

  loadHighscoreWeekGlobal() {
    this.highscoreService.getHighscoreGlobalWeek().subscribe(hs => {
      this.highscoreWeekGlobal = hs;
      this.weekGlobalLoaded = true;
    })
  }

  loadHighscoreWeekLocal() {
    this.highscoreService.getHighscoreLocalWeek().subscribe(hs => {
      this.highscoreWeekLocal = hs;
      this.weekLocalLoaded = true;
    })
  }

  loadHighscoreTotalGlobal() {
    this.highscoreService.getHighscoreGlobalTotal().subscribe(hs => {
      this.highscoreTotalGlobal = hs;
      this.totalGlobalLoaded = true;
    })
  }

  loadHighscoreTotalLocal() {
    this.highscoreService.getHighscoreLocalTotal().subscribe(hs => {
      this.highscoreTotalLocal = hs;
      this.totalLocalLoaded = true;
    })
  }
}
