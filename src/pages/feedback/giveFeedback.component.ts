import {Component} from "@angular/core";
import {NavController, ViewController, NavParams, Platform} from "ionic-angular";
import {Feedback} from "../../providers/domain/feedback";
import {Model} from "../../providers/services/model.service";
import {MessagesService} from "../../providers/services/messages.service";
import {NotificationService} from "../../providers/services/notification.service";

@Component({
  templateUrl: 'giveFeedback.component.html'
})
export class GiveFeedbackComponent {
  feedback: Feedback;
  type: string;

  constructor(public nav: NavController,
              public navParams: NavParams,
              public model: Model,
              public feedbackService: MessagesService,
              public notificationService: NotificationService,
              public viewCtrl: ViewController,
              public platform: Platform) {
    this.type = navParams.get('type');
    this.feedback = new Feedback();
    this.feedback.type = this.type;
  }

  sendFeedback() {
    this.feedbackService.sendFeedback(this.feedback).subscribe(
      feedback => {
        this.model.feedback.unshift(feedback);
        this.feedback = new Feedback();
        this.feedback.type = this.type;
        this.notificationService.showToast({
          message: 'Thank you for your feedback',
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'OK'
        });
        this.close();
      }
    );
  }

  // Modal close
  close() {
    this.viewCtrl.dismiss();
  }
}
