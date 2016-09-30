import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoadingPage} from "../pages/loading/loading";
import 'rxjs/Rx';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class AtpApp {
  rootPage = LoadingPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
}
