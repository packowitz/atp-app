import {Component, Input} from "@angular/core";
import {HighscoreUser} from "../../providers/domain/highscoreUser";
@Component({
  selector: 'highscore-entry',
  template: `<ion-item *ngFor="let hs of highscore; let i = index" class="highscore-row" [class.itsme]="hs.itsme">
                <ion-label class="highscore-entry">
                    <ion-note padding-left padding-right>
                        {{i + 1}}
                    </ion-note>
                    <span class="highscore-name">
                        <img src="assets/img/flags/{{hs.country}}.png" class="flag highscore-name-element">
                        <ion-icon [name]="hs.male ? 'male' : 'female'" class="highscore-name-element"></ion-icon>
                        <span class="highscore-name-element">{{getAge(hs)}} yrs.</span>
                        <span class="highscore-name-element">{{hs.username? hs.username : 'Anonymous'}}</span>
                    </span>
                    <ion-badge color="white">
                    {{showWeek ? hs.surveysAnsweredWeek : hs.surveysAnswered}} <ion-icon name="trophy" color="atp-golder"></ion-icon>
                    </ion-badge>
                </ion-label>
            </ion-item>`
})
export class HighscoreEntryComponent {
  @Input()
  highscore: HighscoreUser[];
  @Input()
  showWeek: boolean;

  getAge(hs: HighscoreUser) {
    return new Date().getFullYear() - hs.yearOfBirth;
  }
}
