import {Injectable} from "@angular/core";
import {Firebase} from "@ionic-native/firebase";
import {Platform} from "ionic-angular";

@Injectable()
export class Analytics {

  constructor(public firebase: Firebase, public platform: Platform) {
  }

  public enterPage(name: string) {
    if(this.platform.is('cordova')) {
      this.firebase.setScreenName(name);
    }
  }
  public event(name: string, event: any) {
    if(this.platform.is('cordova')) {
      this.firebase.logEvent(name, event);
    }
  }
}
