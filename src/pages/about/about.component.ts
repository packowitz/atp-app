import {Component} from "@angular/core";
import {ViewController, Platform} from "ionic-angular";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'about.component.html'
})
export class AboutComponent {

  currentYear: number = new Date().getFullYear();

  constructor(public viewCtrl: ViewController,
              public platform: Platform) {
  }

  ionViewDidEnter() {
    Analytics.enterPage("About");
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
