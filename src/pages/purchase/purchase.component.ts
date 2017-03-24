import {Component} from "@angular/core";
import {Model} from "../../providers/services/model.service";
import {Reward} from "../../providers/domain/reward";
import {ShopService} from "../../providers/services/shop.service";
import {NavController, AlertController} from "ionic-angular";
import {CouponService} from "../../providers/services/coupon.service";
import {PersonalDataComponent} from "../personalData/personalData.component";
import {InAppProduct} from "../../providers/domain/inAppProduct";
import {InAppPurchase} from "ionic-native";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Analytics} from "../../providers/services/analytics.service";

@Component({
  templateUrl: 'purchase.component.html',
  selector: 'purchase-page'
})
export class PurchaseComponent {
  selection: string = 'rewards';
  couponExpand: boolean = false;
  couponForm: FormGroup;
  couponCode: string;

  constructor(public model: Model,
              public shopService: ShopService,
              public nav: NavController,
              public alertCtrl: AlertController,
              public fb: FormBuilder,
              public couponService: CouponService) {
    this.couponForm = fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(25)])]
    });
    this.selection = model.claimableRewards > 0 ? 'rewards' : 'shop';
  }

  ionViewDidEnter() {
    Analytics.enterPage("Purchase");
  }

  claimReward(reward: Reward) {
    Analytics.event("claim_reward_" + reward.type, {page: "Purchase"});
    this.shopService.claimReward(reward.type);
  }

  openPersonalDataPage() {
    Analytics.event("open_personal_data", {page: "Purchase"});
    this.nav.push(PersonalDataComponent);
  }

  buyProduct(product: InAppProduct) {
    Analytics.event("buy_" + product.title, {page: "Purchase"});
    this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'You are going to buy <strong>' + product.title + '</strong> for <strong>' + product.price + '</strong>. Payment is done via App Store.',
      buttons: [
        {text: 'Cancel'},
        {text: 'Check out', handler: () => {
          console.log("You are buying " + product.title + " for " + product.price);
          Analytics.event("buy_confirm_" + product.title, {page: "Purchase"});
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
    this.alertCtrl.create({
      title: 'Payment failed',
      message: 'Something went wrong with the payment. We are very sorry about that. Please try again later.',
      buttons: [{text: 'OK'}]
    }).present();
  }

  showPaymentSuccess() {
    this.alertCtrl.create({
      title: 'Purchased',
      message: 'Thank you for your purchase.',
      buttons: [{text: 'OK'}]
    }).present();
  }

  redeemCode() {
    Analytics.event("coupon_redeem", {page: "Purchase"});
    this.couponService.redeemCoupon(this.couponCode).subscribe(
      data => {
        this.couponCode = "";
        this.model.user = data.user;
        let reward = data.reward;
        this.alertCtrl.create({
          title: 'Coupon redeemed',
          message: 'You received ' + reward + ' pax.',
          buttons: [{text: 'OK'}]
        }).present();

        this.couponExpand = false;
      }
    );
  }
}
