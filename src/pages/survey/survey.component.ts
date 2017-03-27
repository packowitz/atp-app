import {AlertController, Slides} from "ionic-angular";
import {SurveyService} from "../../providers/services/survey.service";
import {Survey} from "../../providers/domain/survey";
import {Component, trigger, state, style, transition, animate, keyframes, ViewChild} from "@angular/core";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'survey.component.html',
  selector: 'survey',
  animations: [
    trigger('titleState', [
      state('active', style({transform: 'translateY(0)'})),
      transition('* => active', [
        animate("1.5s ease-in-out", keyframes([
          style({opacity: 0, transform: 'translateY(40vh)', offset: 0}),
          style({opacity: 1, transform: 'translateY(40vh)', offset: 0.15}),
          style({opacity: 1, transform: 'translateY(40vh)', offset: 0.85}),
          style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
        ]))
      ])
    ]),
    trigger('pic1State', [
      transition('* => incomingWithTitle', [
        animate("1.7s 1.5s ease-in-out", keyframes([
          style({opacity: 0, top: '50vh', left: '50vw', width: '0', height: '0', offset: 0}),
          style({opacity: 1, top: '20vh', left: '6vw', width: '88vw', height: '88vw', offset: 0.1}),
          style({opacity: 1, top: '20vh', left: '6vw', width: '88vw', height: '88vw', offset: 0.9}),
          style({left: '6vw', top: '20vh', width: '41vw', height: '41vw', offset: 1.0})
        ]))
      ]),
      transition('* => incoming', [
        animate("1.7s 0.2s ease-in-out", keyframes([
          style({opacity: 0, top: '50vh', left: '50vw', width: '0', height: '0', offset: 0}),
          style({opacity: 1, top: '20vh', left: '6vw', width: '88vw', height: '88vw', offset: 0.1}),
          style({opacity: 1, top: '20vh', left: '6vw', width: '88vw', height: '88vw', offset: 0.9}),
          style({left: '6vw', top: '20vh', width: '41vw', height: '41vw', offset: 1.0})
        ]))
      ]),
    ]),
    trigger('pic2State', [
      transition('* => incomingWithTitle', [
        animate("1.7s 3.4s ease-in-out", keyframes([
          style({opacity: 0, top: '50vh', right: '50vw', width: '0', height: '0', offset: 0}),
          style({opacity: 1, top: '20vh', right: '6vw', width: '88vw', height: '88vw', offset: 0.1}),
          style({opacity: 1, top: '20vh', right: '6vw', width: '88vw', height: '88vw', offset: 0.9}),
          style({right: '6vw', top: '20vh', width: '41vw', height: '41vw', offset: 1.0})
        ]))
      ]),
      transition('* => incoming', [
        animate("1.7s 2.1s ease-in-out", keyframes([
          style({opacity: 0, top: '50vh', right: '50vw', width: '0', height: '0', offset: 0}),
          style({opacity: 1, top: '20vh', right: '6vw', width: '88vw', height: '88vw', offset: 0.1}),
          style({opacity: 1, top: '20vh', right: '6vw', width: '88vw', height: '88vw', offset: 0.9}),
          style({right: '6vw', top: '20vh', width: '41vw', height: '41vw', offset: 1.0})
        ]))
      ]),
    ]),
    trigger('buttonState', [
      transition('* => incomingWithTitle', [
        style({opacity: 0}),
        animate("0.5s 5.1s", style({opacity: 1}))
      ]),
      transition('* => incoming', [
        style({opacity: 0}),
        animate("0.5s 3.8s", style({opacity: 1}))
      ])
    ])
  ]
})
export class SurveyComponent {
  survey: Survey;
  @ViewChild('pictureSlider') slider: Slides;

  titleAnimationState: string;
  pic1AnimationState: string;
  pic2AnimationState: string;
  buttonAnimationState: string;
  animationOver: boolean;
  showSlider: boolean;
  iDontKnowImageIndex: number;

  constructor(public surveyService: SurveyService,
              public alertController: AlertController,
              public analytics: Analytics) {
    this.loadSurvey();
  }

  ionViewDidEnter() {
    this.analytics.enterPage("AnswerAtp");
  }

  loadSurvey() {
    this.surveyService.getSurveyToAnswer().subscribe(data => this.showSurvey(data));
  }

  selectPicture(picNr: number) {
    if(this.animationOver) {
      this.analytics.event("send_selection_" + picNr, {page: "AnswerAtp"});
      this.surveyService.postResult(this.survey, picNr).subscribe(data => this.showSurvey(data));
    } else {
      this.analytics.event("too_early_click", {page: "AnswerAtp"});
    }
  }

  slideClick() {
    //with looping pic1 can be 1 or 4 and idk-pic 3 or 0
    let idx = this.slider.getActiveIndex() % 3;
    this.selectPicture(idx);
  }

  showSurvey(survey: Survey) {
    this.animationOver = false;
    this.showSlider = false;
    this.iDontKnowImageIndex = Math.floor(Math.random() * 3);

    this.survey = survey;
    if(this.survey.title) {
      this.titleAnimationState = "active";
      this.pic1AnimationState = "incomingWithTitle";
      this.pic2AnimationState = "incomingWithTitle";
      this.buttonAnimationState = "incomingWithTitle";
    } else {
      this.pic1AnimationState = "incoming";
      this.pic2AnimationState = "incoming";
      this.buttonAnimationState = "incoming";
    }
  }

  animationDone() {
    if(this.buttonAnimationState != null) {
      this.animationOver = true;

      this.titleAnimationState = null;
      this.pic1AnimationState = null;
      this.pic2AnimationState = null;
      this.buttonAnimationState = null;
    }
  }

  toggleSlider(picNumber: number) {
    this.analytics.event("enlarge_picture", {page: "AnswerAtp"});
    //TODO: when showing slider, slide to the pic given in picNumber
    this.showSlider = !this.showSlider;
  }

  reportAbuse() {
    this.analytics.event("report_abuse_hint", {page: "AnswerAtp"});
    this.alertController.create({
      title: 'Report Abuse',
      message: "Abuse means that you think that these pictures show <strong>illegal</strong> or <strong>offensive</strong> content.<br/>If you don't think this is illegal or offensive, please tap 'Cancel'.",
      buttons: [
        {text: 'Cancel'},
        {text: 'Report Abuse', handler: () => {
          this.analytics.event("send_report_abuse", {page: "AnswerAtp"});
          this.selectPicture(-1);
        }}
      ]
    }).present();
  }
}
