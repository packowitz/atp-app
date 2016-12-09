import {PipeTransform, Pipe} from "@angular/core";
import {Survey} from "../domain/survey";

@Pipe({name: 'surveyContainsPicture'})
export class SurveyContainsPicturePipe implements PipeTransform {
  transform(value: Survey[], picId: number) : Survey[] {
    let surveys = [];
    value.forEach(survey => {
      if(survey.pic1_id == picId || survey.pic2_id == picId) {
        surveys.push(survey);
      }
    });
    return surveys;
  }
}
