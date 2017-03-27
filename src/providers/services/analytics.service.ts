import {Injectable} from "@angular/core";
import {Firebase} from "@ionic-native/firebase";

@Injectable()
export class Analytics {

  constructor(public firebase: Firebase) {
  }

  public enterPage(name: string) {
    this.firebase.setScreenName(name);
  }
  public event(name: string, event: any) {
    this.firebase.logEvent(name, event);
  }
}
