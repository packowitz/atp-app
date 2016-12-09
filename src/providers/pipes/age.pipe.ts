import {PipeTransform, Pipe} from "@angular/core";
import {Answer} from "../domain/answer";

export class AgePipeResult {
  age: number;
  pic1: number = 0;
  pic2: number = 0;
  noOpinion: number = 0;

  constructor(age: number) {
    this.age = age;
  }
}

@Pipe({name: 'age'})
export class AgePipe implements PipeTransform {
  public static resolveKey(ageDiff, age) {
    return age;
  }
  transform(value: Answer[], args?: string[]) : AgePipeResult[] {
    var ages = {};
    let minAge = 100;
    let maxAge = 0;
    value.forEach(answer => {
      minAge = answer.age < minAge ? answer.age : minAge;
      maxAge = answer.age > maxAge ? answer.age : maxAge;
    });
    let ageDiff = maxAge - minAge;

    value.forEach(answer => {
      let age = AgePipe.resolveKey(ageDiff, answer.age);
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
      return ages[AgePipe.resolveKey(ageDiff, key)]
    });
  }
}
