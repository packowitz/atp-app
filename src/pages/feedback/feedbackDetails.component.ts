import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Feedback} from "../../providers/domain/feedback";
import {MessagesService} from "../../providers/services/messages.service";
import {FeedbackAnswer} from "../../providers/domain/feedbackAnswer";
import {Model} from "../../providers/services/model.service";
import {Util} from "../../providers/domain/util";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'feedbackDetails.component.html'
})
export class FeedbackDetailsComponent {
  public feedback: Feedback;
  public answers: FeedbackAnswer[] = [];
  public newAnswer: FeedbackAnswer;

  constructor(public navParams: NavParams,
              public model: Model,
              public feedbackService: MessagesService) {
    this.feedback = navParams.get('feedback');
    this.loadAnswers();
  }

  ionViewDidEnter() {
    Analytics.enterPage("FeedbackDetails");
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  loadAnswers() {
    if(this.feedback.answers) {
      this.feedbackService.loadFeedbackAnswers(this.feedback.id).subscribe(
        answers => {
          this.answers = answers;
          if(this.feedback.unreadAnswers > 0) {
            this.feedback.unreadAnswers = 0;
            this.model.recalcUnreadMessages();
          }
        }
      );
    }
  }

  closeFeedback() {
    Analytics.event("close_feedback", {page: "FeedbackDetails"});
    this.feedbackService.closeFeedback(this.feedback).subscribe(
      feedback => Feedback.update(this.feedback, feedback)
    );
  }

  editResponse() {
    Analytics.event("edit_response", {page: "FeedbackDetails"});
    this.newAnswer = new FeedbackAnswer();
  }

  sendAnswer() {
    Analytics.event("send_response", {page: "FeedbackDetails"});
    this.feedbackService.sendFeedbackAnswer(this.feedback, this.newAnswer).subscribe(
      response => {
        this.newAnswer = null;
        this.answers.push(response.answer);
        Feedback.update(this.feedback, response.feedback);
      }
    );
  }

}
