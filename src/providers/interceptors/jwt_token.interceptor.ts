import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {LocalStorage} from "../services/localStorage.service";

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor(public localStorage: LocalStorage) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.localStorage.getToken();
    if(token) {
      req = req.clone({setHeaders: {Authorization: 'Bearer ' + token}});
    }
    return next.handle(req);
  }
}
