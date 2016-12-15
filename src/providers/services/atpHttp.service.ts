import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Headers, Http} from "@angular/http";
import {Model} from "./model.service";
import {NotificationService} from "./notification.service";
import {AlertController, Alert} from "ionic-angular";
import {LocalStorage} from "./localStorage.service";

@Injectable()
export class AtpHttp {
  public static timeout: number = 15000;

  constructor(public http: Http,
              public model: Model,
              public localStorage: LocalStorage,
              public notificationService: NotificationService,
              public alertController: AlertController) {
  }

  doGet(uri: string, loadingMessage: string): Observable<any> {
    this.notificationService.showLoading(loadingMessage);
    let headers: Headers = new Headers();
    if(this.localStorage.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.localStorage.getToken());
    }
    return this.http.get(Model.server + uri, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doGet(uri, loadingMessage)))
      .map(data => this.handleData(data));
  }

  doGetBackground(uri: string): Observable<any> {
    let headers: Headers = new Headers();
    if(this.localStorage.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.localStorage.getToken());
    }
    return this.http.get(Model.server + uri, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doGetBackground(uri)))
      .map(data => this.handleData(data));
  }

  doPost(uri: string, body: any, loadingMessage: string): Observable<any> {
    this.notificationService.showLoading(loadingMessage);
    let headers: Headers = new Headers();
    if(this.localStorage.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.localStorage.getToken());
    }
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + uri, body ? JSON.stringify(body) : null, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doPost(uri, body, loadingMessage)))
      .map(data => this.handleData(data));
  }

  doPostBackground(uri: string, body: any): Observable<any> {
    let headers: Headers = new Headers();
    if(this.localStorage.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.localStorage.getToken());
    }
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + uri, body ? JSON.stringify(body) : null, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doPostBackground(uri, body)))
      .map(data => this.handleData(data));
  }

  doPut(uri: string, body: any, loadingMessage: string): Observable<any> {
    this.notificationService.showLoading(loadingMessage);
    let headers: Headers = new Headers();
    if(this.localStorage.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.localStorage.getToken());
    }
    headers.append('Content-Type', 'application/json');
    return this.http.put(Model.server + uri, body ? JSON.stringify(body) : null, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doPut(uri, body, loadingMessage)))
      .map(data => this.handleData(data));
  }

  doDelete(uri: string, loadingMessage: string): Observable<any> {
    this.notificationService.showLoading(loadingMessage);
    let headers: Headers = new Headers();
    if(this.localStorage.getToken()) {
      headers.append('Authorization', 'Bearer ' + this.localStorage.getToken());
    }
    return this.http.delete(Model.server + uri, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doDelete(uri, loadingMessage)))
      .map(() => this.notificationService.dismissLoading());
  }

  public handleData(data): Observable<any> {
    this.notificationService.dismissLoading();
    let response = data.json();
    if(response.user && response.data) {
      this.model.user = response.user;
      return response.data;
    } else {
      return response;
    }
  }

  public retryWhen(error, retry: Function) {
    return error.switchMap(err => Observable.create(observer => {
      //noinspection TypeScriptUnresolvedFunction
      this.notificationService.dismissLoading().then(() => {
        let title: string, message: string, buttons: any[] = [];

        let retryBtn = {text: 'Retry', handler: () => observer.next(retry())};
        let resetAccountBtn = {
          text: 'Reset account',
          handler: () => {
            this.localStorage.clearStorage();
            window.location.reload();
          }
        };
        let closeBtn = {text: 'OK'};
        let homeBtn = {text: 'home',handler: () => window.location.reload()}

        let body = JSON.parse(err._body);
        if(body) {
          title = body.title;
          message = body.message;
          if(body.showRetryBtn) {buttons.push(retryBtn)}
          if(body.showResetAccountBtn) {buttons.push(resetAccountBtn)}
          if(body.showCloseBtn) {buttons.push(closeBtn)}
          if(body.showHomeBtn) {buttons.push(homeBtn)}
        }

        let alert: Alert = this.alertController.create({
          title: title ? title : "Error",
          message: message ? message : "An unknown Error occured.",
          buttons: buttons.length > 0 ? buttons : [closeBtn],
          enableBackdropDismiss: false
        });

        alert.present();
      });
    }));
  }
}
