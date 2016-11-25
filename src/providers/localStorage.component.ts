import {Injectable} from "@angular/core";
import {Model} from "../components/model.component";
import {Platform} from "ionic-angular";

@Injectable()
export class LocalStorage {
  token: string;
  lsKey = "atp-app-dev";

  constructor(public model: Model, public platform: Platform) {
    if(platform.is("cordova") || platform.is("android") || platform.is("ios")) {
      this.lsKey = "atp-app";
    }
    let lsVal = window.localStorage.getItem(this.lsKey);
    if(lsVal) {
      let lsObj = JSON.parse(lsVal);
      this.token = lsObj.token;
    }
  }

  writeToLS() {
    window.localStorage.setItem(this.lsKey, JSON.stringify({
      token: this.token
    }));
  }

  clearStorage() {
    window.localStorage.removeItem(this.lsKey);
  }

  public getToken(): string {
    return this.token;
  }

  public setToken(token: string) {
    this.token = token;
    this.writeToLS();
  }
}
