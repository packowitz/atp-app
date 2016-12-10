import {User} from "../domain/user";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Model} from "../../components/model.component";
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

  login(email: string, password: string): Observable<TokenResponse> {
    return this.atpHttp.doPost("/auth/login", {email: email, password: password}, "Logging in");
  }

  getUser(message?: string): Observable<User> {
    if(message) {
      return this.atpHttp.doGet("/app/user", message);
    } else {
      return this.atpHttp.doGetBackground("/app/user");
    }
  }

  postUsername(username: string): Observable<User> {
    return this.atpHttp.doPost("/app/user/username", {username: username}, "Sending username");
  }

  secureAccount(email: string, password: string): Observable<User> {
    return this.atpHttp.doPost("/app/user/secure-account", {email: email, password: password}, "Securing your account");
  }

  resendConfirmationEmail(): Observable<User> {
    return this.atpHttp.doPost("/app/user/resend-confirmation-email", {}, "Sending confirmation email");
  }

  postNewEmail(email: string, password: string): Observable<User> {
    return this.atpHttp.doPost("/app/user/email", {email: email, password: password}, "Sending your email address");
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
