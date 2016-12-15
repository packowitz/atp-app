import {Component} from "@angular/core";
import {NavController, ViewController} from "ionic-angular/index";
import {Model} from "../../providers/services/model.service";
import {Util} from "../../providers/domain/util";
import {FeedbackDetailsComponent} from "./feedbackDetails.component";

@Component({
  templateUrl: 'feedback.component.html'
})
export class FeedbackComponent {

  constructor(public nav: NavController,
              public model: Model,
              public viewCtrl: ViewController) {
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  showFeedbackDetails(feedback) {
    this.nav.push(FeedbackDetailsComponent, {feedback: feedback});
  }

  // Modal close
  close() {
    this.viewCtrl.dismiss();
  }
}
