import {Component} from "@angular/core";
import {Model} from "../../components/model.component";

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(public model: Model) {}
}
