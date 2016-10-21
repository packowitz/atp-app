import {Component, Input} from "@angular/core";
import {HighscoreUser} from "../../components/domain/highscoreUser.component";
@Component({
  selector: 'highscore-entry',
  template: `<ion-item *ngFor="let hs of highscore; let i = index" class="highscore-row" [class.itsme]="hs.itsme">
                <ion-label class="highscore-entry">
                    <span>{{i + 1}}.</span>
                    <span class="highscore-name">
                        <img src="img/flags/{{hs.countries}}.png" class="flag highscore-name-element">
                        <ion-icon [name]="hs.male ? 'male' : 'female'" class="highscore-name-element"></ion-icon>
                        <span class="highscore-name-element">{{getAge(hs)}} yrs.</span>
                        <span class="highscore-name-element">{{hs.username? hs.username : 'Anonymous'}}</span>
                    </span>
                    <span>{{showWeek ? hs.surveysAnsweredWeek : hs.surveysAnswered}} <ion-icon name="trophy" class="trophy"></ion-icon></span>
                </ion-label>
            </ion-item>`
})
export class HighscoreEntry {
  @Input()
  highscore: HighscoreUser[];
  @Input()
  showWeek: boolean;

  getAge(hs: HighscoreUser) {
    return new Date().getFullYear() - hs.yearOfBirth;
  }
}