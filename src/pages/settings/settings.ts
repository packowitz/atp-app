import {Component} from "@angular/core";
import {Model} from "../../components/model.component";
import {ViewController} from "ionic-angular";

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(public model: Model,
              public viewCtrl: ViewController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
