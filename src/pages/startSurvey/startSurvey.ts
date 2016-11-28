import {Platform, Tabs, ActionSheetController, PopoverController} from "ionic-angular";
import {NgZone} from "@angular/core";
import {Camera, CameraOptions} from "ionic-native";
import {Survey} from "../../providers/domain/survey";
import {Model} from "../../components/model.component";
import {SurveyService} from "../../providers/survey.service";
import {RandomImage} from "../../components/randomImage.component";
import {Component} from "@angular/core";
import {CountrySelection} from "../../components/countrySelection.component";
import {User} from "../../providers/domain/user";
import {NotificationService} from "../../providers/notification.service";
import {SurveyType} from "../../providers/domain/surveyType";
import {Messages} from "../../components/messages";
import {LocalStorage} from "../../providers/localStorage.component";

declare var Croppie: any;

@Component({
  templateUrl: 'startSurvey.html'
})
export class StartSurveyPage {
  cameraOptions: CameraOptions = {
    destinationType: 0,
    sourceType: 1,
    encodingType: 0,
    quality:50,
    allowEdit: false,
    saveToPhotoAlbum: false
  };
  survey: Survey;
  surveyType: SurveyType;
  countries: string[];
  ageRange = {lower: 1, upper: 99};
  saveAsDefault: boolean = true;
  exampleText: string;
  croppie: any;
  croppieFirst: boolean;

  constructor(public platform: Platform,
              public ngZone: NgZone,
              public model: Model,
              public localStorage: LocalStorage,
              public surveyService: SurveyService,
              public tabs: Tabs,
              public actionSheetController: ActionSheetController,
              public popoverController: PopoverController,
              public notificationService: NotificationService) {
    this.createEmptySurvey(model.user);
  }

  createEmptySurvey(user: User) {
    this.surveyType = this.model.surveyTypes[0];
    this.exampleText = Messages.getStartAtpExampleMsg();
    this.survey = new Survey();
    this.countries = user.surveyCountry && user.surveyCountry != 'ALL' ? user.surveyCountry.split(",") : user.country ? [user.country] : [];
    this.survey.male = user.surveyMale !== false;
    this.survey.female = user.surveyFemale !== false;
    this.ageRange.lower = user.surveyMinAge ? user.surveyMinAge : 1;
    this.ageRange.upper = user.surveyMaxAge ? user.surveyMaxAge : 99;
  }

  showCroppie(src: string, first: boolean) {
    this.destroyCroppie();
    this.croppieFirst = first;
    let imgWidth = window.innerWidth * 0.8;
    this.croppie = new Croppie(document.getElementById('new-croppie'), {
      viewport: {width: 300, height: 300},
      boundary: {width: imgWidth, height: imgWidth},
      enableOrientation: true
    });
    this.croppie.bind({url: 'data:image/jpeg;base64,' + src});
  }

  destroyCroppie() {
    if(this.croppie) {
      this.croppie.destroy();
      this.croppie = null;
    }
  }

  saveCroppedPicture() {
    if(this.croppie) {
      this.croppie.result({
        type: 'canvas',
        size: 'viewport',
        format: 'jpeg',
        quality: 0.5
      }).then(data => {
        if(this.croppieFirst) {
          this.survey.pic1 = data.substring(data.indexOf(",") + 1);
        } else {
          this.survey.pic2 = data.substring(data.indexOf(",") + 1);
        }
        this.destroyCroppie();
      });
    }
  }

  rotateLeft() {
    if(this.croppie) {
      this.croppie.rotate(-90);
    }
  }

  rotateRight() {
    if(this.croppie) {
      this.croppie.rotate(90);
    }
  }

  doTakePicture(isFirstPic: boolean, source: number) {
    this.cameraOptions.sourceType = source;
    Camera.getPicture(this.cameraOptions).then(data => {
      this.ngZone.run(() => {
        this.showCroppie(data, isFirstPic);
      });
    }, error => {alert(error);});
  }

  choosePicture(isFirstPic: boolean) {
    this.actionSheetController.create({
      title: 'Choose action',
      cssClass: 'action-sheets-basic-page',
      buttons: [{
        text: 'Camera',
        icon: this.platform.is('ios') ? null : 'camera',
        handler: () => {
          this.doTakePicture(isFirstPic, 1);
        }
      }, {
        text: 'Gallery',
        icon: this.platform.is('ios') ? null : 'image',
        handler: () => {
          this.doTakePicture(isFirstPic, 0);
        }
      }, {
        text: 'Dummy for Test',
        icon: this.platform.is('ios') ? null : 'bug',
        handler: () => {
          this.chooseDummyPicture(isFirstPic);
        }
      }
      ]
    }).present();
  }

  chooseDummyPicture(isFirstPic: boolean) {
    this.showCroppie(RandomImage.getRandomImage(), isFirstPic);
  }

  changeGender(event: Event) {
    if(this.survey.male && this.survey.female) {
      this.survey.male = false;
    } else if(this.survey.male) {
      this.survey.female = true;
    } else {
      this.survey.male = true;
      this.survey.female = false;
    }
    event.preventDefault();
  }

  addCountry(event: Event) {
    event.preventDefault();
    let countrySelection = this.popoverController.create(CountrySelection, {callback: country => {
      if(this.countries.indexOf(country.alpha3) == -1) {
        this.countries.push(country.alpha3);
        this.countries.sort();
      }
      countrySelection.dismiss();
    }});
    countrySelection.present();
  }

  removeCountry(country: string) {
    let idx = this.countries.indexOf(country);
    if(idx != -1) {
      this.countries.splice(idx,1);
    }
  }

  changeSurveyType(event: Event) {
    event.preventDefault();
    for(let i=0; i < this.model.surveyTypes.length; i++) {
      if(this.model.surveyTypes[i].key == this.surveyType.key) {
        let nextIdx = i + 1;
        if(this.model.surveyTypes.length == nextIdx) {
          nextIdx = 0;
        }
        this.surveyType = this.model.surveyTypes[nextIdx];
        return;
      }
    }
  }

  surveyComplete(): boolean {
    return this.survey.pic1 != null && this.survey.pic2 != null && this.model.user.credits >= this.surveyType.costs;
  }

  public startSurvey() {
    this.survey.minAge = this.ageRange.lower;
    this.survey.maxAge = this.ageRange.upper;
    this.survey.countries = "";
    if(this.countries.length > 0) {
      this.countries.forEach(c => {
        if(this.survey.countries != "") {
          this.survey.countries += ",";
        }
        this.survey.countries += c;
      });
    } else {
      this.survey.countries = "ALL";
    }
    this.surveyService.postSurvey(this.survey, this.surveyType.key, this.saveAsDefault).subscribe(resp => {
      console.log("ATP started");
      this.localStorage.addSurvey(resp);
      this.notificationService.showToast({
        message: 'ATP started',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      this.createEmptySurvey(this.model.user);
      this.tabs.select(Model.MainTab);
    });
  }

}
