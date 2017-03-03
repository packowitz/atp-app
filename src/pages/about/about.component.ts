import {Component} from "@angular/core";
import {ViewController, Platform} from "ionic-angular";

@Component({
  templateUrl: 'about.component.html'
})
export class AboutComponent {

  constructor(public viewCtrl: ViewController,
              public platform: Platform) {
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
