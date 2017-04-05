import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import {Network} from "@ionic-native/network";

/**
 * Detects if internet connection is available
 * @author: Max Tuzzolino
 */
@Injectable()
export class ConnectivityService {
  onDevice: boolean;

  constructor(public platform: Platform, public network: Network) {
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if (this.onDevice && this.network.type != 'none') {
      return this.network.type != 'none';
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && this.network.type == 'none') {
      return this.network.type == 'none';
    } else {
      return !navigator.onLine;
    }
  }
}
