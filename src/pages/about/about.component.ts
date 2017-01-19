import {Component} from "@angular/core";
import {ViewController, Platform} from "ionic-angular";

/**
 * About page
 * Author: Max Tuzzolino
 */

@Component({
  templateUrl: 'about.component.html'
})
export class AboutComponent {

  aboutExpand: boolean = false;
  legalExpand: boolean = false;

  constructor(public viewCtrl: ViewController,
              public platform: Platform) {
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
