import {PipeTransform, Pipe} from "@angular/core";
import {Answer} from "../domain/answer";

export class AgePipeResult {
  ageRange: number;
  pic1: number = 0;
  pic2: number = 0;
  noOpinion: number = 0;

  constructor(ageRange: number) {
    this.ageRange = ageRange;
  }
}

@Pipe({name: 'age'})
export class AgePipe implements PipeTransform {
  transform(value: Answer[], args?: string[]) : AgePipeResult[] {
    var ages = {};
    value.forEach(answer => {
      let age = answer.ageRange;
      ages[age] = ages[age] ? ages[age] : new AgePipeResult(age);
      if(answer.answer == 1) {
        ages[age].pic1 ++;
      } else if (answer.answer == 2) {
        ages[age].pic2 ++;
      } else {
        ages[age].noOpinion ++;
      }
    });
    return Object.keys(ages).map(function (key) {
      return ages[key]
    });
  }
}
