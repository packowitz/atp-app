import {Component} from "@angular/core";
import {Model} from "../../components/model.component";
import {Reward} from "../../providers/domain/reward";
import {RewardService} from "../../providers/services/reward.service";
import {NavController, AlertController} from "ionic-angular";
import {CouponService} from "../../providers/services/coupon.service";
import {PersonalDataPage} from "../personalData/personalData.page";

@Component({
  templateUrl: 'purchase.html',
  selector: 'purchase-page'
})
export class PurchasePage {
  selection: string = 'rewards';
  couponCode: string;

  constructor(public model: Model,
              public rewardService: RewardService,
              public couponService: CouponService,
              public nav: NavController,
              public alertController: AlertController) {
    model.claimableRewards > 0 ? this.selection = 'rewards' : 'shop';
  }

  redeemCoupon() {
    this.couponService.redeemCoupon(this.couponCode).subscribe(
      data => {
        this.couponCode = "";
        this.model.user = data.user;
        let reward = data.reward;
        this.alertController.create({
          title: 'Coupon redeemed',
          message: 'You received ' + reward + ' pax.',
          buttons: [{text: 'OK'}]
        }).present();
      }
    );
  }

  claimReward(reward: Reward) {
    this.rewardService.claimReward(reward.type);
  }

  openPersonalDataPage() {
    this.nav.push(PersonalDataPage);
  }
}
