import {Component} from "@angular/core";
import {NavController, PopoverController, ViewController} from "ionic-angular/index";
import {ChooseFeedbackType} from "./chooseFeedbackType";
import {Feedback} from "../../providers/domain/feedback";
import {Model} from "../../components/model.component";
import {MessagesService} from "../../providers/services/messages.service";
import {Util} from "../../components/util.component";
import {FeedbackDetailsPage} from "./feedbackDetails";

@Component({
  templateUrl: 'feedback.page.html'
})
export class FeedbackPage {
  newFeedback: Feedback = new Feedback();

  constructor(public nav: NavController,
              public model: Model,
              public feedbackService: MessagesService,
              public popoverController: PopoverController,
              public viewCtrl: ViewController) {
  }

  startGiveFeedback() {
    let popover = this.popoverController.create(ChooseFeedbackType, {
      callback: type => {
        this.newFeedback.type = type;
        popover.dismiss();
      }
    });
    popover.present();
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  showFeedbackDetails(feedback) {
    this.nav.push(FeedbackDetailsPage, {feedback: feedback});
  }

  sendFeedback() {
    this.feedbackService.sendFeedback(this.newFeedback).subscribe(
      feedback => {
        this.newFeedback = new Feedback();
        this.model.feedback.unshift(feedback);
      }
    );
  }

  // Modal close
  close() {
    this.viewCtrl.dismiss();
  }
}
