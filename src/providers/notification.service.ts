import {Injectable} from "@angular/core";
import {LoadingController, Loading, Toast, ToastController} from "ionic-angular";

@Injectable()
export class NotificationService {
  loading: Loading;
  toast: Toast;

  constructor(public loadingController: LoadingController, public toastController: ToastController) {
  }

  showLoading(message: string) {
    if(this.loading) {
      //noinspection TypeScriptUnresolvedFunction
      this.dismissLoading().then(() => this.showLoading(message));
    }
    this.loading = this.loadingController.create({
      content: message,
      spinner: 'dots'
    });
    this.loading.present();
  }

  //noinspection TypeScriptUnresolvedVariable
  dismissLoading(): Promise<any> {
    if(this.loading) {
      return this.loading.dismiss().then(() => this.loading = null);
    } else {
      //noinspection TypeScriptUnresolvedFunction
      return new Promise(func => func());
    }
  }

  showToast(options: any) {
    if(this.loading) {
      //noinspection TypeScriptUnresolvedFunction
      this.dismissLoading().then(() => this.showToast(options));
    }
    if(this.toast) {
      //noinspection TypeScriptUnresolvedFunction
      this.dismissToast().then(() => this.showToast(options));
    }
    this.toast = this.toastController.create(options);
    this.toast.present();
  }

  //noinspection TypeScriptUnresolvedVariable
  dismissToast(): Promise<any> {
    if(this.toast) {
      return this.toast.dismiss().then(() => this.toast = null);
    } else {
      //noinspection TypeScriptUnresolvedFunction
      return new Promise(func => func());
    }
  }
}
