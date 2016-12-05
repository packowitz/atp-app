import {Component} from "@angular/core";
import {NavController, ViewController} from "ionic-angular/index";
import {Model} from "../../components/model.component";
import {Util} from "../../components/util.component";

@Component({
  templateUrl: 'announcements.page.html'
})
export class AnnouncementsPage {

  constructor(public nav: NavController,
              public model: Model,
              public viewCtrl: ViewController) {
  }

  getTimeDiff(date: string) {
    return Util.getTimeDiff(date);
  }

  // Modal close
  close() {
    this.viewCtrl.dismiss();
  }
}
