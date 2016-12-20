import {Injectable} from "@angular/core";
import {AtpHttp} from "./atpHttp.service";
import {Observable} from "rxjs";
import {Reward} from "../domain/reward";
import {Model} from "./model.service";
import {InAppProduct} from "../domain/inAppProduct";
import {User} from "../domain/user";
import {Platform} from "ionic-angular";

@Injectable()
export class ShopService {

    constructor(public atpHttp: AtpHttp, public model: Model, public platform: Platform) {}

    getRewards(): Observable<Reward[]> {
        return this.atpHttp.doGetBackground("/app/reward/list");
    }

    claimReward(type: string) {
      this.atpHttp.doPost("/app/reward/claim/" + type, {}, "claiming reward").subscribe(
        data => {
          this.model.user = data.user;
          this.model.setRewards(data.rewards);
        }
      );
    }

    purchaseProduct(productId: string, receipt: string): Observable<User> {
      let purchase: any = {
        productId: productId,
        receipt: receipt
      };
      if(this.platform.is("android")) {
        purchase.os = 'android';
      } else if(this.platform.is("ios")) {
        purchase.os = 'ios';
      } else {
        purchase.os = 'unknown';
      }
      return this.atpHttp.doPost("/app/user/iap/purchase", purchase, "purchasing product");
    }

    consumeProduct(productId: string): Observable<User> {
      return this.atpHttp.doPost("/app/user/iap/consume/" + productId, {}, "consuming product");
    }
}
