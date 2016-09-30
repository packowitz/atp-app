import {Platform, Tabs, ActionSheetController, PopoverController} from "ionic-angular";
import {NgZone} from "@angular/core";
import {CameraOptions} from "ionic-native/dist/plugins/camera";
import {Camera} from "ionic-native";
import {Survey} from "../../components/domain/survey.component";
import {Model} from "../../components/model.component";
import {SurveyService} from "../../providers/survey.service";
import {RandomImage} from "../../components/randomImage.component";
import {Component} from "@angular/core";
import {CountrySelection} from "../../components/countrySelection.component";
import {User} from "../../components/domain/user.component";
import {NotificationService} from "../../providers/notification.service";

@Component({
  templateUrl: 'startSurvey.html'
})
export class StartSurveyPage {
  cameraOptions: CameraOptions = {
    destinationType: 0,
    sourceType: 1,
    encodingType: 0,
    quality:100,
    targetWidth: 300,
    targetHeight: 300,
    allowEdit: true,
    saveToPhotoAlbum: false
  };
  survey: Survey;
  countries: string[];
  ageRange = {lower: 1, upper: 99};
  saveAsDefault: boolean = true;

  constructor(public platform: Platform,
              public ngZone: NgZone,
              public model: Model,
              public surveyService: SurveyService,
              public tabs: Tabs,
              public actionSheetController: ActionSheetController,
              public popoverController: PopoverController,
              public notificationService: NotificationService) {
    this.createEmptySurvey(model.user);
  }

  createEmptySurvey(user: User) {
    this.survey = new Survey();
    this.countries = user.surveyCountry && user.surveyCountry != 'ALL' ? user.surveyCountry.split(",") : user.country ? [user.country] : [];
    this.survey.male = user.surveyMale !== false;
    this.survey.female = user.surveyFemale !== false;
    this.ageRange.lower = user.surveyMinAge ? user.surveyMinAge : 1;
    this.ageRange.upper = user.surveyMaxAge ? user.surveyMaxAge : 99;
  }

  doTakePicture(isFirstPic: boolean, source: number) {
    this.cameraOptions.sourceType = source;
    Camera.getPicture(this.cameraOptions).then(data => {
      this.ngZone.run(() => {
        if(isFirstPic) {
          this.survey.pic1 = data;
        } else {
          this.survey.pic2 = data;
        }
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
    if(isFirstPic) {
      this.survey.pic1 = RandomImage.getRandomImage();
    } else {
      this.survey.pic2 = RandomImage.getRandomImage();
    }
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

  addCountry() {
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

  surveyComplete(): boolean {
    return this.survey.pic1 != null && this.survey.pic2 != null;
  }

  public startSurvey() {
    this.survey.minAge = this.ageRange.lower;
    this.survey.maxAge = this.ageRange.upper;
    this.survey.country = "";
    if(this.countries.length > 0) {
      this.countries.forEach(c => {
        if(this.survey.country != "") {
          this.survey.country += ",";
        }
        this.survey.country += c;
      });
    } else {
      this.survey.country = "ALL";
    }
    this.surveyService.postSurvey(this.survey, "NUMBER100", this.saveAsDefault).subscribe(resp => {
      console.log("ATP started");
      this.model.last3surveys.unshift(resp);
      if(this.model.last3surveys.length > 3) {
        this.model.last3surveys.pop();
      }
      this.notificationService.showToast({
        message: 'ATP started',
        duration: 5000,
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      this.createEmptySurvey(this.model.user);
      this.tabs.select(Model.MainTab);
    });
  }

}
