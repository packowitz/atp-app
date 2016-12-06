import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";

/**
 * About page
 * Author: Max Tuzzolino
 */

@Component({
  templateUrl: 'about.page.html'
})
export class AboutPage {

  aboutExpand: boolean = false;
  legalExpand: boolean = false;

  constructor(public viewCtrl: ViewController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
