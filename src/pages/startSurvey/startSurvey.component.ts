import {ActionSheetController, AlertController, ModalController, Platform, Tabs} from "ionic-angular";
import {Component, NgZone} from "@angular/core";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Survey} from "../../providers/domain/survey";
import {Model} from "../../providers/services/model.service";
import {SurveyService} from "../../providers/services/survey.service";
import {RandomImage} from "../../providers/domain/randomImage";
import {NotificationService} from "../../providers/services/notification.service";
import {SurveyType} from "../../providers/domain/surveyType";
import {Messages} from "../../providers/domain/messages";
import {LocalStorage} from "../../providers/services/localStorage.service";
import {SurveySettings} from "../../providers/domain/surveySettings";
import {Country} from "../../providers/domain/country";
import {CountrySelectionComponent} from "../countrySelection/countrySelection.component";
import {Analytics} from "../../providers/services/analytics.service";
import {AgeRange} from "../../providers/domain/ageRange";

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
  selectedCountries: Country[] = [];
  selectedAgeRanges: AgeRange[] = [];
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
              public modalCtrl: ModalController,
              public notificationService: NotificationService,
              public alertController: AlertController,
              public analytics: Analytics,
              public camera: Camera) {
    if(this.localStorage.hintSettings.seenCreateAtpHint !== true) {
      let hintAlert = this.alertController.create({
        title: 'Create your ATP',
        message: 'This is where you will create your own ATPs. Choose your audience by age, gender and countries and upload two pictures or more!',
        buttons: [{text: 'OK'}]
      });
      hintAlert.onDidDismiss(() => {
        this.localStorage.hintSettings.seenCreateAtpHint = true;
        this.localStorage.saveHintSettings();
      });
      hintAlert.present();
    }
    this.createEmptySurvey();
  }

  ionViewDidEnter() {
    this.analytics.enterPage("CreateAtp");
  }

  createEmptySurvey() {
    this.surveyType = this.model.surveyTypes[0];
    this.exampleText = Messages.getStartAtpExampleMsg();
    this.pictures = [];
    this.numberOfSurveys = 1;
    this.survey = new Survey();
    let lastSettings: SurveySettings = this.localStorage.getLastSurveySettings();
    this.selectedCountries = lastSettings ? lastSettings.countries : [];
    this.selectedAgeRanges = lastSettings ? lastSettings.ageRanges : [];
    this.survey.male = lastSettings ? lastSettings.male : true;
    this.survey.female = lastSettings ? lastSettings.female : true;
  }

  showCroppie(src: string) {
    this.destroyCroppie();

    let size = window.innerWidth * 0.8;

    this.croppie = new Croppie(document.getElementById('new-croppie'), {
      viewport: {width: 300, height: 300},
      boundary: {width: size, height: size},
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
    this.analytics.event("image_rotate_left", {page: "CreateAtp"});
    if(this.croppie) {
      this.croppie.rotate(-90);
    }
  }

  rotateRight() {
    this.analytics.event("image_rotate_right", {page: "CreateAtp"});
    if(this.croppie) {
      this.croppie.rotate(90);
    }
  }

  doTakePicture(source: number) {
    this.cameraOptions.sourceType = source;
    this.camera.getPicture(this.cameraOptions).then(data => {
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
          this.analytics.event("image_choose_camera", {page: "CreateAtp"});
          this.doTakePicture(1);
        }
      }, {
        text: 'Gallery',
        icon: this.platform.is('ios') ? null : 'image',
        handler: () => {
          this.analytics.event("image_choose_gallery", {page: "CreateAtp"});
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
    this.analytics.event("image_remove", {page: "CreateAtp"});
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
    this.analytics.event("change_gender", {page: "CreateAtp"});
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

  ageSelectedText(): string {
    if(!this.selectedAgeRanges ||
      this.selectedAgeRanges.length == 0 ||
      this.selectedAgeRanges.length == this.model.ageRanges.length) return 'no restriction';
    if(this.selectedAgeRanges.length == 1) return this.selectedAgeRanges[0].name;
    return this.selectedAgeRanges.length + ' groups';
  }

  showCountrySelection() {
    this.analytics.event("show_country_selection", {page: "CreateAtp"});
    let countrySelection = this.modalCtrl.create(CountrySelectionComponent, {selectedCountries: this.selectedCountries});
    countrySelection.present();

    // Update selected countries
    countrySelection.onDidDismiss(data => {
      if (data) {
        this.selectedCountries = data;
      }
    });
  }

  changeSurveyType(event: Event) {
    this.analytics.event("change_type", {page: "CreateAtp"});
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
    this.analytics.event("show_multi_picture_hint", {page: "CreateAtp"});
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
    if(!this.survey.title) {
      this.analytics.event("show_no_title_hint", {page: "CreateAtp"});
      this.alertController.create({
        title: 'This ATP has no title',
        message: 'A title is helpful to point out what you want to ask the people. Continue without title?',
        buttons: [
          {text: 'Cancel', handler: () => this.analytics.event("no_title_cancel", {page: "CreateAtp"})},
          {text: 'Continue', handler: () => this.submitSurvey()}
        ]
      }).present();
    } else {
      this.submitSurvey();
    }
  }

  public submitSurvey() {
    this.analytics.event("create_new_atp", {page: "CreateAtp"});
    //store settings in local storage as default for next survey
    let settings: SurveySettings = new SurveySettings();

    settings.countries = this.selectedCountries;
    settings.male = this.survey.male;
    settings.female = this.survey.female;
    settings.ageRanges = this.selectedAgeRanges;
    this.localStorage.setLastSurveySettings(settings);

    if(!this.selectedAgeRanges || this.selectedAgeRanges.length == 0) {
      this.selectedAgeRanges = this.model.ageRanges;
    }
    this.selectedAgeRanges.forEach(r => {
      this.survey['age_' + r.id] = true;
    });

    this.survey.countries = "";
    if (this.selectedCountries.length > 0) {
      this.selectedCountries.forEach(c => {
        if (this.survey.countries != "") {
          this.survey.countries += ",";
        }

        this.survey.countries += c.alpha3;
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
