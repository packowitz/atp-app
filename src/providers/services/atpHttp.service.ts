import {Injectable, ViewChild} from "@angular/core";
import {Observable} from "rxjs";
import {Model} from "./model.service";
import {NotificationService} from "./notification.service";
import {AlertController, Alert, NavController} from "ionic-angular";
import {LocalStorage} from "./localStorage.service";
import {LoadingState} from "../../pages/loading/loadingState.component";
import {LoadingComponent} from "../../pages/loading/loading.component";
import {HttpClient} from "@angular/common/http";
import {retryWhen, map, switchMap} from "rxjs/operators";

@Injectable()
export class AtpHttp {

  @ViewChild('content') nav: NavController;

  constructor(public http: HttpClient,
              public model: Model,
              public localStorage: LocalStorage,
              public loadingState: LoadingState,
              public notificationService: NotificationService,
              public alertController: AlertController) {
  }

  doGet<T>(uri: string, loadingMessage: string): Observable<T> {
    this.notificationService.showLoading(loadingMessage);
    return this.http.get<T>(Model.server + uri).pipe(
      map(data => this.dismissLoading(data)),
      retryWhen(error => this.retryWhen(error))
    );
  }

  doGetBackground<T>(uri: string): Observable<T> {
    return this.http.get<T>(Model.server + uri).pipe(
      retryWhen(error => this.retryWhen(error))
    );
  }

  doPost<T>(uri: string, body: any, loadingMessage: string): Observable<T> {
    this.notificationService.showLoading(loadingMessage);
    return this.http.post<T>(Model.server + uri, body).pipe(
      map(data => this.dismissLoading(data)),
      retryWhen(error => this.retryWhen(error))
    );
  }

  doPostBackground<T>(uri: string, body: any): Observable<T> {
    return this.http.post<T>(Model.server + uri, body).pipe(
      retryWhen(error => this.retryWhen(error))
    );
  }

  doPut<T>(uri: string, body: any, loadingMessage: string): Observable<T> {
    this.notificationService.showLoading(loadingMessage);
    return this.http.put<T>(Model.server + uri, body).pipe(
      map(data => this.dismissLoading(data)),
      retryWhen(error => this.retryWhen(error))
    );
  }

  doDelete<T>(uri: string, loadingMessage: string): Observable<T> {
    this.notificationService.showLoading(loadingMessage);
    return this.http.delete<T>(Model.server + uri, {responseType: 'text' as 'json'}).pipe(
      map(data => this.dismissLoading(data)),
      retryWhen(error => this.retryWhen(error))
    );
  }

  private dismissLoading(data) {
    console.log(data);
    this.notificationService.dismissLoading();
    return data ? data : {};
  }

  private retryWhen(error): Observable<any> {
    return error.pipe(switchMap((err:any) => Observable.create(observer => {
      this.notificationService.dismissLoading().then(() => {
        let title: string, message: string, buttons: any[] = [];

        let retryBtn = {text: 'Retry', handler: () => observer.next()};
        let resetAccountBtn = {
          text: 'Reset account',
          handler: () => {
            this.localStorage.clearStorage();
            this.loadingState.reset();
            this.nav.setRoot(LoadingComponent);
          }
        };
        let closeBtn = {text: 'OK'};
        let homeBtn = {text: 'home', handler: () => this.nav.setRoot(LoadingComponent)};

        if(err.status == 0) {
          title = 'Network error';
          message = 'Please check that you are connected to the internet';
          buttons.push(retryBtn);
        } else {
          title = err.error.title;
          message = err.error.message;
          if(err.error.showRetryBtn) {buttons.push(retryBtn)}
          if(err.error.showResetAccountBtn) {buttons.push(resetAccountBtn)}
          if(err.error.showCloseBtn) {buttons.push(closeBtn)}
          if(err.error.showHomeBtn) {buttons.push(homeBtn)}
        }

        let alert: Alert = this.alertController.create({
          title: title ? title : "Error",
          message: message ? message : "An unknown Error occured.",
          buttons: buttons.length > 0 ? buttons : [closeBtn],
          enableBackdropDismiss: false
        });

        alert.present();
      });
    })));
  }
}
