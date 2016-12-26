import {Component} from "@angular/core";
import {Model} from "../../providers/services/model.service";
import {Reward} from "../../providers/domain/reward";
import {ShopService} from "../../providers/services/shop.service";
import {NavController, AlertController, PopoverController, ViewController} from "ionic-angular";
import {CouponService} from "../../providers/services/coupon.service";
import {PersonalDataComponent} from "../personalData/personalData.component";
import {InAppProduct} from "../../providers/domain/inAppProduct";
import {InAppPurchase} from "ionic-native";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  templateUrl: 'purchase.component.html',
  selector: 'purchase-page'
})
export class PurchaseComponent {
  selection: string = 'rewards';

  constructor(public model: Model,
              public shopService: ShopService,
              public popoverCtrl: PopoverController,
              public nav: NavController,
              public alertController: AlertController) {
    console.log("User has " + model.claimableRewards + " claimable rewards");
    model.claimableRewards > 0 ? this.selection = 'rewards' : 'shop';
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

  showCouponInput(event) {
    this.popoverCtrl.create(CouponInputComponent).present({ev: event});
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

/**
 * Coupon input screen
 */
@Component({
  template: `
    <!-- INPUT --> 
    <form [formGroup]="couponForm">
      <ion-item no-lines>
        <ion-label stacked>Coupon</ion-label>
        <ion-input type="text" placeholder="Enter your coupon code" formControlName="code" [(ngModel)]="couponCode"></ion-input>
      </ion-item>
      <p *ngIf="couponForm.controls['code'].touched && !couponForm.controls['code'].valid" color="danger" padding-left>
        Please enter a valid coupon code.
      </p>
    </form>
        
    <!-- FINALIZE BUTTONS --> 
    <ion-item>
          <button ion-button clear item-right (click)="dismissPopover()">
              Exit
          </button>
        <button ion-button clear item-right [disabled]="!couponForm.valid" (click)="redeemCode()">
            Redeem
        </button>
    </ion-item>
`
})
export class CouponInputComponent {
  couponForm: FormGroup;
  couponCode: string;

  constructor(public viewCtrl: ViewController,
              public model: Model,
              public alertCtrl: AlertController,
              public fb: FormBuilder,
              public couponService: CouponService) {
    this.couponForm = fb.group({
      code: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(25)])]
    });
  }

  dismissPopover() {
    this.viewCtrl.dismiss();
  }

  redeemCode() {
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

        this.dismissPopover();
      }
    );
  }
}
