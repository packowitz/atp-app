import {PipeTransform, Pipe} from "@angular/core";
import {Answer} from "../providers/domain/answer";

export class GenderPipeResult {
  gender: string;
  pic1: number = 0;
  pic2: number = 0;
  noOpinion: number = 0;

  constructor(gender: string) {
    this.gender = gender;
  }
}

@Pipe({name: 'gender'})
export class GenderPipe implements PipeTransform {
  transform(value: Answer[], args?: string[]) : GenderPipeResult[] {
    var gender = {};
    value.forEach(answer => {
      let sex = answer.male ? 'male' : 'female';
      gender[sex] = gender[sex] ? gender[sex] : new GenderPipeResult(sex);
      if(answer.answer == 1) {
        gender[sex].pic1 ++;
      } else if (answer.answer == 2) {
        gender[sex].pic2 ++;
      } else {
        gender[sex].noOpinion ++;
      }
    });
    return Object.keys(gender).map(function (key) {
      return gender[key]
    });
  }
}
