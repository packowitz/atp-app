export class Feedback {
  id: number;
  type: string;
  status: string;
  sendDate: string;
  lastActionDate: string;
  title: string;
  message: string;
  answers: number;
  unreadAnswers: number;

  static update(original: Feedback, feedback: Feedback) {
    original.status = feedback.status;
    original.lastActionDate = feedback.lastActionDate;
    original.answers = feedback.answers;
    original.unreadAnswers = feedback.unreadAnswers;
  }
}