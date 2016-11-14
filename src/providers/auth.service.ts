import {User} from "../components/domain/user.component";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Model} from "../components/model.component";
import {AtpHttp} from "./atpHttp.service";

export class TokenResponse {
  token: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(public model: Model, public atpHttp: AtpHttp) {}

  registerNewUser(): Observable<TokenResponse> {
    return this.atpHttp.doPost("/auth/register", null, "Starting ATP");
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.atpHttp.doPost("/auth/login", {username: username, password: password}, "Logging in");
  }

  getUserByToken(token: string): Observable<User> {
    this.model.token = token;
    return this.atpHttp.doGetBackground("/app/user");
  }

  postUsername(username: string, password: string): Observable<User> {
    return this.atpHttp.doPost("/app/user/username", {username: username, password: password}, "Sending credentials");
  }

  postNotification(enabled: boolean, soundEnabled: boolean, vibrationEnabled: boolean): Observable<User> {
    let data: any = {enabled: enabled, soundEnabled: soundEnabled, vibrationEnabled: vibrationEnabled};
    return this.atpHttp.doPostBackground("/app/user/notifications", data);
  }

  postPersonalData(yearOfBirth: number, male: boolean, country: string): Observable<User> {
    let data: any = {'yearOfBirth': yearOfBirth, male: male, country: country};
    return this.atpHttp.doPost("/app/user/personal-data", data, "Sending your data");
  }

  postDeviceBackground(deviceOs: string, regId: string): Observable<User> {
    return this.atpHttp.doPostBackground("/app/user/device", {deviceOs: deviceOs, notificationRegId: regId});
  }
}
