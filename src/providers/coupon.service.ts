import {Injectable} from "@angular/core";
import {User} from "./domain/user";
import {Observable} from "rxjs";
import {AtpHttp} from "./atpHttp.service";

export class RedeemResponse {
  user: User;
  reward: number;
}

@Injectable()
export class CouponService {

  constructor(public atpHttp: AtpHttp) {}

  redeemCoupon(code: string): Observable<RedeemResponse> {
    return this.atpHttp.doPost("/app/coupon/redeem", {code: code}, "claiming reward");
  }
}
