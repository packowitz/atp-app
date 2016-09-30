import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Feedback} from "../components/domain/feedback.component";
import {FeedbackAnswer} from "../components/domain/feedbackAnswer.component";
import {Announcement} from "../components/domain/announcement.component";
import {AtpHttp} from "./atpHttp.service";

export class FeedbackAnswerResponse {
  feedback: Feedback;
  answer: FeedbackAnswer;
}

@Injectable()
export class MessagesService {

  constructor(public atpHttp: AtpHttp) {}

  loadFeedback(): Observable<Feedback[]> {
    return this.atpHttp.doGetBackground("/app/feedback/list");
  }

  loadAnnouncements(): Observable<Announcement[]> {
    return this.atpHttp.doGetBackground("/app/announcement/list");
  }

  loadFeedbackAnswers(id: number): Observable<FeedbackAnswer[]> {
    return this.atpHttp.doGet("/app/feedback/answers/" + id, "Loading Feedback Details");
  }

  sendFeedback(feedback: Feedback): Observable<Feedback> {
    return this.atpHttp.doPost("/app/feedback/", feedback, "Sending Feedback");
  }

  closeFeedback(feedback: Feedback): Observable<Feedback> {
    return this.atpHttp.doPut("/app/feedback/close/", null, "Closing Conversation");
  }

  sendFeedbackAnswer(feedback: Feedback, answer: FeedbackAnswer): Observable<FeedbackAnswerResponse> {
    return this.atpHttp.doPost("/app/feedback/answer/" + feedback.id, answer, "Sending Response");
  }
}
