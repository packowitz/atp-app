import {Tabs, AlertController} from "ionic-angular";
import {SurveyService} from "../../providers/survey.service";
import {Survey} from "../../components/domain/survey.component";
import {Component, trigger, state, style, transition, animate, keyframes} from "@angular/core";
import {Model} from "../../components/model.component";

@Component({
  templateUrl: 'survey.html',
  animations: [
    trigger('titleState', [
      state('active', style({transform: 'translateY(0)'})),
      transition('* => active', [
        animate("1.5s ease-in-out", keyframes([
          style({opacity: 0, transform: 'translateY(48vh)', offset: 0}),
          style({opacity: 1, transform: 'translateY(48vh)', offset: 0.15}),
          style({opacity: 1, transform: 'translateY(48vh)', offset: 0.85}),
          style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
        ]))
      ])
    ]),
    trigger('pic1State', [
      state('large', style({top: '68vw', width: '92vw', height: '92vw'})),
      transition('* => incomingWithTitle', [
        animate("1.7s 1.5s ease-in-out", keyframes([
          style({opacity: 0, top: '116vw', left: '50vw', width: '0', height: '0', offset: 0}),
          style({opacity: 1, top: '68vw', left: '4vw', width: '92vw', height: '92vw', offset: 0.1}),
          style({opacity: 1, top: '68vw', left: '4vw', width: '92vw', height: '92vw', offset: 0.9}),
          style({left: '4vw', top: '8vh', width: '44vw', height: '44vw', offset: 1.0})
        ]))
      ]),
      transition('* => incoming', [
        animate("1.7s ease-in-out", keyframes([
          style({opacity: 0, top: '116vw', left: '50vw', width: '0', height: '0', offset: 0}),
          style({opacity: 1, top: '68vw', left: '4vw', width: '92vw', height: '92vw', offset: 0.1}),
          style({opacity: 1, top: '68vw', left: '4vw', width: '92vw', height: '92vw', offset: 0.9}),
          style({left: '4vw', top: '8vh', width: '44vw', height: '44vw', offset: 1.0})
        ]))
      ]),
      transition('* => large', [
        style({'z-index': 15}),
        animate('0.2s ease-in-out')
      ]),
      transition('large => small', [
        animate('0.2s ease-in-out')
      ])
    ]),
    trigger('pic2State', [
      state('large', style({top: '68vw', width: '92vw', height: '92vw'})),
      transition('* => incomingWithTitle', [
        animate("1.7s 3.5s ease-in-out", keyframes([
          style({opacity: 0, top: '116vw', right: '50vw', width: '0', height: '0', offset: 0}),
          style({opacity: 1, top: '68vw', right: '4vw', width: '92vw', height: '92vw', offset: 0.1}),
          style({opacity: 1, top: '68vw', right: '4vw', width: '92vw', height: '92vw', offset: 0.9}),
          style({right: '4vw', top: '8vh', width: '44vw', height: '44vw', offset: 1.0})
        ]))
      ]),
      transition('* => incoming', [
        animate("1.7s 2s ease-in-out", keyframes([
          style({opacity: 0, top: '116vw', right: '50vw', width: '0', height: '0', offset: 0}),
          style({opacity: 1, top: '68vw', right: '4vw', width: '92vw', height: '92vw', offset: 0.1}),
          style({opacity: 1, top: '68vw', right: '4vw', width: '92vw', height: '92vw', offset: 0.9}),
          style({right: '4vw', top: '8vh', width: '44vw', height: '44vw', offset: 1.0})
        ]))
      ]),
      transition('* => large', [
        animate('0.2s ease-in-out')
      ]),
      transition('large => small', [
        animate('0.2s ease-in-out')
      ])
    ]),
    trigger('buttonState', [
      transition('* => incomingWithTitle', [
        style({opacity: 0}),
        animate("0.5s 5.2s", style({opacity: 1}))
      ]),
      transition('* => incoming', [
        style({opacity: 0}),
        animate("0.5s 3.7s", style({opacity: 1}))
      ])
    ])
  ]
})
export class SurveyPage {
  survey: Survey;

  titleAnimationState: string;
  pic1AnimationState: string;
  pic2AnimationState: string;
  buttonAnimationState: string;

  constructor(public surveyService: SurveyService,
              public tabs: Tabs,
              public alertController: AlertController) {
    this.loadSurvey();
  }

  loadSurvey() {
    this.surveyService.getSurveyToAnswer().subscribe(data => this.showSurvey(data));
  }

  selectPicture(picNr: number) {
    this.surveyService.postResult(this.survey, picNr).subscribe(data => this.showSurvey(data));
  }

  showSurvey(survey: Survey) {
    this.survey = null;
    this.titleAnimationState = null;
    this.pic1AnimationState = null;
    this.pic2AnimationState = null;
    this.buttonAnimationState = null;

    setTimeout(() => {
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
    }, 10);
  }

  togglePic1() {
    if(this.pic1AnimationState == 'large') {
      this.pic1AnimationState = 'small';
    } else {
      if(this.pic2AnimationState == 'large') {
        this.pic2AnimationState = 'small';
      }
      this.pic1AnimationState = 'large';
    }
  }

  togglePic2() {
    if(this.pic2AnimationState == 'large') {
      this.pic2AnimationState = 'small';
    } else {
      if(this.pic1AnimationState == 'large') {
        this.pic1AnimationState = 'small';
      }
      this.pic2AnimationState = 'large';
    }
  }

  goHome() {
    this.tabs.select(Model.MainTab);
  }

  reportAbuse() {
    this.alertController.create({
      title: 'Report Abuse',
      message: "Abuse means that you think that these pictures show <strong>illegal</strong> or <strong>illegitimate</strong> content.<br/>If you just don't have a meaning on these picture then please press 'skip'.",
      buttons: [
        {text: 'Cancel'},
        {text: 'Report Abuse', handler: () => this.selectPicture(3)}
      ]
    }).present();
  }
}
