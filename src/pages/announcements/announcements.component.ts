import {Component} from "@angular/core";
import {NavController, ViewController, Platform} from "ionic-angular";
import {Model} from "../../providers/services/model.service";
import {Util} from "../../providers/domain/util";

@Component({
  templateUrl: 'announcements.component.html'
})
export class AnnouncementsComponent {

  constructor(public nav: NavController,
              public model: Model,
              public viewCtrl: ViewController,
              public platform: Platform) {
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  // Modal close
  close() {
    this.viewCtrl.dismiss();
  }
}
