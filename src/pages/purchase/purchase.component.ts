import {Component} from "@angular/core";
import {Model} from "../../providers/services/model.service";
import {Reward} from "../../providers/domain/reward";
import {ShopService} from "../../providers/services/shop.service";
import {NavController, AlertController} from "ionic-angular";
import {CouponService} from "../../providers/services/coupon.service";
import {PersonalDataComponent} from "../personalData/personalData.component";
import {InAppProduct} from "../../providers/domain/inAppProduct";
import {InAppPurchase} from "ionic-native";

@Component({
  templateUrl: 'purchase.component.html',
  selector: 'purchase-page'
})
export class PurchaseComponent {
  selection: string = 'rewards';
  couponCode: string;

  constructor(public model: Model,
              public shopService: ShopService,
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
    this.shopService.claimReward(reward.type);
  }

  openPersonalDataPage() {
    this.nav.push(PersonalDataComponent);
  }

  buyProduct(product: InAppProduct) {
    this.alertController.create({
      title: 'Confirm purchase',
      message: 'You are going to buy <strong>' + product.title + '</strong> for <strong>' + product.price + '</strong>. Payment is done via App Store.',
      buttons: [
        {text: 'Cancel'},
        {text: 'Check out', handler: () => {
          console.log("You are buying " + product.title + " for " + product.price);
          InAppPurchase.buy(product.productId).then(
            data => {
              this.shopService.purchaseProduct(product.productId, data.receipt).subscribe(
                () => {
                  InAppPurchase.consume(data.productType, data.receipt, data.signature).then(
                    () => {
                      this.shopService.consumeProduct(product.productId).subscribe(
                        () => this.showPaymentSuccess(),
                        err => this.showPaymentFailed()
                      );
                    }
                  ).catch(err => this.showPaymentFailed());
                },
                err => this.showPaymentFailed()
              );
            }
          ).catch(err => this.showPaymentFailed());
        }}
      ]
    }).present();
  }

  showPaymentFailed() {
    this.alertController.create({
      title: 'Payment failed',
      message: 'Something went wrong with the payment. We are very sorry about that. Please try again later.',
      buttons: [{text: 'OK'}]
    }).present();
  }

  showPaymentSuccess() {
    this.alertController.create({
      title: 'Purchased',
      message: 'Thank you for your purchase.',
      buttons: [{text: 'OK'}]
    }).present();
  }
}
