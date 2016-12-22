import {User} from "../domain/user";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Model} from "./model.service";
import {AtpHttp} from "./atpHttp.service";
import {Version} from "../domain/version";

export class TokenResponse {
  token: string;
  user: User;
}

export class SuccessResponse {
  success: boolean;
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

  requestNewPassword(email: string): Observable<any> {
    return this.atpHttp.doPost("/auth/forgot-password", {email: email}, "Resetting password");
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

  postNewPassword(oldPw: string, newPw: string): Observable<User> {
    return this.atpHttp.doPost("/app/user/change-password", {oldPassword: oldPw, newPassword: newPw}, "Changing your password");
  }

  postPersonalData(yearOfBirth: number, male: boolean, country: string): Observable<User> {
    let data: any = {'yearOfBirth': yearOfBirth, male: male, country: country};
    return this.atpHttp.doPost("/app/user/personal-data", data, "Sending your data");
  }

  checkAppVersion(): Observable<SuccessResponse> {
    let version: Version = new Version();
    return this.atpHttp.doPostBackground("/version/check", {major: version.major, minor: version.minor, patch: version.patch});
  }
}
