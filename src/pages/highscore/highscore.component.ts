import {Component} from "@angular/core";
import {HighscoreService} from "../../providers/services/highscore.service";
import {HighscoreUser} from "../../providers/domain/highscoreUser";
import {ViewController, Platform} from "ionic-angular";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  selector: 'highscore-page',
  templateUrl: 'highscore.component.html'
})
export class HighscoreComponent {
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

  constructor(public highscoreService: HighscoreService,
              public viewCtrl: ViewController,
              public platform: Platform,
              public analytics: Analytics) {
  }

  ionViewDidEnter() {
    this.loadHighscoreWeekGlobal();
    this.analytics.enterPage("Highscore");
  }

  close() {
    this.viewCtrl.dismiss();
  }

  switchWeekGlobalLocal() {
    this.showWeekGlobal = !this.showWeekGlobal;
    this.analytics.event(this.showTotalGlobal ? "show_weekly_global" : "show_weekly_local", {page: "Highscore"});
    if(!this.showWeekGlobal && !this.weekLocalLoaded) {
      this.loadHighscoreWeekLocal();
    }
  }

  switchTotalGlobalLocal() {
    this.showTotalGlobal = !this.showTotalGlobal;
    this.analytics.event(this.showTotalGlobal ? "show_total_global" : "show_total_local", {page: "Highscore"});
    if(!this.showTotalGlobal && !this.totalLocalLoaded) {
      this.loadHighscoreTotalLocal();
    }
  }

  ionChange() {
    if(!this.totalGlobalLoaded) {
      this.loadHighscoreTotalGlobal();
    }
    this.analytics.event("switched_to_" + this.selection, {page: "Highscore"});
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
