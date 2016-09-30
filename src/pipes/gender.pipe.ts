import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name: 'gender'})
export class GenderPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    var gender = {};
    value.forEach(answer => {
      let sex = answer.male ? 'male' : 'female';
      gender[sex] = gender[sex] ? gender[sex] : {gender: sex, pic1: 0, pic2: 0, noOpinion: 0};
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
