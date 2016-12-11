import {Component} from "@angular/core";
import {NavController, ViewController} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {Util} from "../../components/util.component";
import {FeedbackDetailsPage} from "./feedbackDetails";

@Component({
  templateUrl: 'feedback.page.html'
})
export class FeedbackPage {

  constructor(public nav: NavController,
              public model: Model,
              public viewCtrl: ViewController) {
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  showFeedbackDetails(feedback) {
    this.nav.push(FeedbackDetailsPage, {feedback: feedback});
  }

  // Modal close
  close() {
    this.viewCtrl.dismiss();
  }
}
