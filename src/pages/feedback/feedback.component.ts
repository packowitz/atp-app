import {Component} from "@angular/core";
import {NavController, ViewController, Platform, ModalController, FabContainer} from "ionic-angular";
import {Model} from "../../providers/services/model.service";
import {Util} from "../../providers/domain/util";
import {FeedbackDetailsComponent} from "./feedbackDetails.component";
import {Analytics} from "../../providers/services/analytics.service";
import {GiveFeedbackComponent} from "./giveFeedback.component";

@Component({
  templateUrl: 'feedback.component.html'
})
export class FeedbackComponent {

  constructor(public nav: NavController,
              public model: Model,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public platform: Platform,
              public analytics: Analytics) {
  }

  ionViewDidEnter() {
    this.analytics.enterPage("MyFeedback");
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

  showImprovementPage(fab: FabContainer) {
    fab.close();
    this.analytics.event("open_write_feedback_improvement", {page: "MyFeedback"});
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'IMPROVEMENT'}).present();
  }

  showBugReportPage(fab: FabContainer) {
    fab.close();
    this.analytics.event("open_write_feedback_bug", {page: "MyFeedback"});
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'BUG_REPORT'}).present();
  }

  showMessageSuggestionPage(fab: FabContainer) {
    fab.close();
    this.analytics.event("open_write_feedback_message", {page: "MyFeedback"});
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'MESSAGE_SUGGESTION'}).present();
  }

  showOtherFeedbackPage(fab: FabContainer) {
    fab.close();
    this.analytics.event("open_write_feedback_other", {page: "MyFeedback"});
    this.modalCtrl.create(GiveFeedbackComponent, {type: 'OTHER'}).present();
  }
}
