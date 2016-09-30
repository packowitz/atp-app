import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Headers, Http} from "@angular/http";
import {Model} from "../components/model.component";
import {NotificationService} from "./notification.service";
import {AlertController, Alert} from "ionic-angular";
import {Storage} from "@ionic/storage";

@Injectable()
export class AtpHttp {
  public static timeout: number = 15000;

  constructor(public http: Http,
              public model: Model,
              public notificationService: NotificationService,
              public alertController: AlertController,
              public storage: Storage) {
  }

  doGet(uri: string, loadingMessage: string): Observable<any> {
    this.notificationService.showLoading(loadingMessage);
    let headers: Headers = new Headers();
    if(this.model.token) {
      headers.append('Authorization', 'Bearer ' + this.model.token);
    }
    return this.http.get(Model.server + uri, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doGet(uri, loadingMessage)))
      .map(data => this.handleData(data));
  }

  doGetBackground(uri: string): Observable<any> {
    let headers: Headers = new Headers();
    if(this.model.token) {
      headers.append('Authorization', 'Bearer ' + this.model.token);
    }
    return this.http.get(Model.server + uri, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doGetBackground(uri)))
      .map(data => this.handleData(data));
  }

  doPost(uri: string, body: any, loadingMessage: string): Observable<any> {
    this.notificationService.showLoading(loadingMessage);
    let headers: Headers = new Headers();
    if(this.model.token) {
      headers.append('Authorization', 'Bearer ' + this.model.token);
    }
    headers.append('Content-Type', 'application/json');
    return this.http.post(Model.server + uri, body ? JSON.stringify(body) : null, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doPost(uri, body, loadingMessage)))
      .map(data => this.handleData(data));
  }

  doPostBackground(uri: string, body: any): Observable<any> {
    let headers: Headers = new Headers();
    if(this.model.token) {
      headers.append('Authorization', 'Bearer ' + this.model.token);
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
    if(this.model.token) {
      headers.append('Authorization', 'Bearer ' + this.model.token);
    }
    headers.append('Content-Type', 'application/json');
    return this.http.put(Model.server + uri, body ? JSON.stringify(body) : null, {headers: headers})
      .timeout(AtpHttp.timeout, new Error('timeout exceeded'))
      .retryWhen(data => this.retryWhen(data, () => this.doPut(uri, body, loadingMessage)))
      .map(data => this.handleData(data));
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
        let title: string, message: string, buttons: any[] = [{text: 'Retry'}];
        if(err.status == 401) {
          title = 'Authentication Error';
          message = 'There is a problem with your account! Retry or reset your account.';
          buttons.unshift({
            text: 'Reset account',
            handler: () => {
              this.model.token = null;
              this.storage.remove('token').then(() => window.location.reload());
            }
          });
        } else if(err.status == 500) {
          title = 'Server Error';
          message = 'Uuups, something unexpected happen. Please try again.';
        } else if(err.status == 404) {
          title = 'Unknown method';
          message = 'You tried to call something that does not exist. What are you doing?';
        } else if(err.status == 403 || !err.status) {
          title = 'Server not reachable';
          message = "ATP server didn't answer. Please try again.";
        } else {
          title = 'Unknown Error';
          message = 'Server returned with error ' + err.status + '. Please try again.';
        }
        let alert: Alert = this.alertController.create({title: title, message: message, buttons: buttons});
        alert.onDidDismiss(() => observer.next(retry()));
        alert.present();
      });
    }));
  }
}
