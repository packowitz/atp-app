import {Component} from "@angular/core";
import {Model} from "../../components/model.component";
import {Achievement} from "../../components/domain/achievement.component";
import {AchievementService} from "../../providers/achievement.service";
import {SettingsPage} from "../settings/settings";
import {NavController, AlertController} from "ionic-angular";
import {CouponService} from "../../providers/coupon.service";
import {NotificationService} from "../../providers/notification.service";

@Component({
  templateUrl: 'purchase.html',
  selector: 'purchase-page'
})
export class PurchasePage {
  selection: string = 'achievements';
  couponCode: string;

  constructor(public model: Model,
              public achievementService: AchievementService,
              public couponService: CouponService,
              public notificationService: NotificationService,
              public nav: NavController,
              public alertController: AlertController) {
    model.claimableAchievements > 0 ? this.selection = 'achievements' : 'shop';
  }

  redeemCoupon() {
    this.couponService.redeemCoupon(this.couponCode).subscribe(
      data => {
        this.notificationService.dismissLoading();
        this.couponCode = "";
        this.model.user = data.user;
        let reward = data.reward;
        this.alertController.create({
          title: 'Coupon redeemed',
          message: 'You received ' + reward + ' pax.',
          buttons: [{text: 'OK'}]
        }).present();
      }, error => {
        this.notificationService.dismissLoading();
        if(error.status == 406) {
          this.alertController.create({
            title: 'Already redeemed?',
            message: 'You already redeemed the code you entered.',
            buttons: [{text: 'OK'}]
          }).present();
        } else {
          this.alertController.create({
            title: 'Wrong code?',
            message: 'The code you entered does not exist or is not valid.',
            buttons: [{text: 'OK'}]
          }).present();
        }
      }
    );
  }

  claimAchievementReward(achievement: Achievement) {
    this.achievementService.claimReward(achievement.type);
  }

  openSettingsPage() {
    this.nav.push(SettingsPage);
  }
}
