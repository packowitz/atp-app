import {Platform, Tabs, ActionSheetController, PopoverController, AlertController} from "ionic-angular";
import {NgZone} from "@angular/core";
import {Camera, CameraOptions} from "ionic-native";
import {Survey} from "../../providers/domain/survey";
import {Model} from "../../providers/services/model.service";
import {SurveyService} from "../../providers/services/survey.service";
import {RandomImage} from "../../providers/domain/randomImage";
import {Component} from "@angular/core";
import {CountrySelectionComponent} from "../countrySelection/countrySelection.component";
import {NotificationService} from "../../providers/services/notification.service";
import {SurveyType} from "../../providers/domain/surveyType";
import {Messages} from "../../providers/domain/messages";
import {LocalStorage} from "../../providers/services/localStorage.service";
import {SurveySettings} from "../../providers/domain/surveySettings";

declare var Croppie: any;

@Component({
  templateUrl: 'startSurvey.component.html'
})
export class StartSurveyComponent {
  cameraOptions: CameraOptions = {
    destinationType: 0,
    sourceType: 1,
    encodingType: 0,
    quality:80,
    allowEdit: false,
    saveToPhotoAlbum: false
  };
  survey: Survey;
  surveyType: SurveyType;
  countries: string[];
  ageRange = {lower: 1, upper: 99};
  exampleText: string;
  pictures: string[];
  croppie: any;
  numberOfSurveys: number;

  constructor(public platform: Platform,
              public ngZone: NgZone,
              public model: Model,
              public localStorage: LocalStorage,
              public surveyService: SurveyService,
              public tabs: Tabs,
              public actionSheetController: ActionSheetController,
              public popoverController: PopoverController,
              public notificationService: NotificationService,
              public alertController: AlertController) {
    this.createEmptySurvey();
  }

  createEmptySurvey() {
    this.surveyType = this.model.surveyTypes[0];
    this.exampleText = Messages.getStartAtpExampleMsg();
    this.pictures = [];
    this.numberOfSurveys = 1;
    this.survey = new Survey();
    let lastSettings: SurveySettings = this.localStorage.getLastSurveySettings();
    this.countries = lastSettings ? lastSettings.countries : [];
    this.survey.male = lastSettings ? lastSettings.male : true;
    this.survey.female = lastSettings ? lastSettings.female : true;
    this.ageRange.lower = lastSettings ? lastSettings.minAge : 5;
    this.ageRange.upper = lastSettings ? lastSettings.maxAge : 99;
  }

  showCroppie(src: string) {
    this.destroyCroppie();
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
        this.pictures.push(data.substring(data.indexOf(",") + 1));
        this.recalculateNumberOfSurveys();
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

  doTakePicture(source: number) {
    this.cameraOptions.sourceType = source;
    Camera.getPicture(this.cameraOptions).then(data => {
      this.ngZone.run(() => {
        this.showCroppie(data);
      });
    }, error => {alert(error);});
  }

  choosePicture(event: Event) {
    event.preventDefault();
    let buttons = [
      {
        text: 'Camera',
        icon: this.platform.is('ios') ? null : 'camera',
        handler: () => {
          this.doTakePicture(1);
        }
      }, {
        text: 'Gallery',
        icon: this.platform.is('ios') ? null : 'image',
        handler: () => {
          this.doTakePicture(0);
        }
      }
    ];
    if(!this.platform.is("cordova") && !this.platform.is("android") && !this.platform.is("ios")) {
      buttons.push({
        text: 'Dummy for Test',
        icon: this.platform.is('ios') ? null : 'bug',
        handler: () => {
          this.chooseDummyPicture();
        }
      });
    }
    this.actionSheetController.create({
      title: 'Choose action',
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    }).present();
  }

  chooseDummyPicture() {
    this.showCroppie(RandomImage.getRandomImage());
  }

  deletePicture(index: number) {
    console.log("delete " + index);
    this.pictures.splice(index, 1);
    this.recalculateNumberOfSurveys();
  }

  recalculateNumberOfSurveys() {
    if (this.pictures.length <= 2) {
      this.numberOfSurveys = 1;
    } else {
      this.numberOfSurveys = (this.pictures.length * (this.pictures.length - 1)) / 2;
    }
  }

  changeGender(event: Event) {
    if (this.survey.male && this.survey.female) {
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
    let countrySelection = this.popoverController.create(CountrySelectionComponent, {callback: country => {
      if (this.countries.indexOf(country.alpha3) == -1) {
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

  showMultiPictureHint() {
    this.alertController.create({
      title: '2+ pictures',
      message: 'If you choose more than 2 pictures then this will lead to an ATP for each combination.',
      buttons: [
        {text: 'OK'}
      ]
    }).present();
  }

  surveyComplete(): boolean {
    return this.pictures.length >= 2 && this.model.user.credits >= (this.numberOfSurveys * this.surveyType.costs);
  }

  public startSurvey() {
    //store settings in local storage as default for next survey
    let settings: SurveySettings = new SurveySettings();
    settings.countries = this.countries;
    settings.male = this.survey.male;
    settings.female = this.survey.female;
    settings.minAge = this.ageRange.lower;
    settings.maxAge = this.ageRange.upper;
    this.localStorage.setLastSurveySettings(settings);

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
    this.surveyService.postSurvey(this.survey, this.surveyType.key, this.pictures).subscribe(resp => {
      console.log("ATP started");
      this.localStorage.addSurveys(resp);
      this.notificationService.showToast({
        message: 'ATP started',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      this.createEmptySurvey();
      this.tabs.select(Model.MainTab);
    });
  }

}
