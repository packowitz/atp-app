import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import {Network} from "ionic-native";

/**
 * Detects if internet connection is available
 * @author: Max Tuzzolino
 */
@Injectable()
export class ConnectivityService {
  onDevice: boolean;

  constructor(public platform: Platform) {
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if (this.onDevice && Network.type != 'none') {
      return Network.type != 'none';
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && Network.type == 'none') {
      return Network.type == 'none';
    } else {
      return !navigator.onLine;
    }
  }
}
