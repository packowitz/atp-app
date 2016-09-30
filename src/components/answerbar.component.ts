import {Component, Input} from "@angular/core";

@Component({
  selector: 'answer-bar',
  template: `
  <div class="survey-item-diagram">
      <div class="survey-item-diagram-pic1" *ngIf="pic1Count > 0" [style.width]="100 * pic1Count / totalCount + '%'">
          <span *ngIf="(100 * pic1Count / totalCount) >= 8" class="diagram-text">{{pic1Count}}</span>
      </div>
      <div class="survey-item-diagram-noOpinion" *ngIf="noOpinionCount > 0" [style.width]="100 * noOpinionCount / totalCount + '%'">
          <span *ngIf="(100 * noOpinionCount / totalCount) >= 8" class="diagram-text">{{noOpinionCount}}</span>
      </div>
      <div class="survey-item-diagram-pic2" *ngIf="pic2Count > 0" [style.width]="100 * pic2Count / totalCount + '%'">
          <span *ngIf="(100 * pic2Count / totalCount) >= 8" class="diagram-text">{{pic2Count}}</span>
      </div>
  </div>`,
  styles: [`
    .survey-item-diagram {
      flex-grow: 1;
      border: 2px black solid;
      background-color: white;
      display: flex;
      font-size: 2vh;
    }
    .survey-item-diagram-pic1 {
      background-color: dodgerblue;
      border-right: 1px black solid;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .survey-item-diagram-noOpinion {
      background-color: darkgrey;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .survey-item-diagram-pic2 {
      background-color: darkorange;
      border-left: 1px black solid;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .diagram-text {
      color: antiquewhite;
      vertical-align: sub;
    }`]
})
export class AnswerBarComponent {
  @Input()
  pic1Count: number;
  @Input()
  pic2Count: number;
  @Input()
  noOpinionCount: number;
  @Input()
  totalCount: number;
}