import {Injectable} from "@angular/core";
import {Model} from "../components/model.component";
import {AlertController} from "ionic-angular";
import {NotificationService} from "./notification.service";
import {Headers, Http} from "@angular/http";
import {User} from "./domain/user";
import {Observable} from "rxjs";
import {LocalStorage} from "./localStorage.component";

export class RedeemResponse {
  user: User;
  reward: number;
}

@Injectable()
export class CouponService {

  constructor(public http: Http,
              public notificationService: NotificationService,
              public model: Model,
              public localStorage: LocalStorage,
              public alertController: AlertController) {}

  redeemCoupon(code: string): Observable<RedeemResponse> {
    this.notificationService.showLoading("claiming reward");
    let headers: Headers = new Headers();
    if(this.localStorage.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.localStorage.getToken());
    }
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + "/app/coupon/redeem", JSON.stringify({code: code}), {headers: headers}).map(data => data.json());
  }
}
