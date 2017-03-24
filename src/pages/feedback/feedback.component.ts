import {Component} from "@angular/core";
import {NavController, ViewController, Platform} from "ionic-angular";
import {Model} from "../../providers/services/model.service";
import {Util} from "../../providers/domain/util";
import {FeedbackDetailsComponent} from "./feedbackDetails.component";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'feedback.component.html'
})
export class FeedbackComponent {

  constructor(public nav: NavController,
              public model: Model,
              public viewCtrl: ViewController,
              public platform: Platform) {
  }

  ionViewDidEnter() {
    Analytics.enterPage("MyFeedback");
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
