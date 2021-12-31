import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../@services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly validRequestForNotAddingToken: Array<string>;
  private readonly validGetRequestForNotAddingToken: Array<string>;

  constructor(private authenticationService: AuthenticationService) {
    this.validRequestForNotAddingToken = [
        'user/login',
        'user/register',
        'user/resetpassword'
    ];
    this.validGetRequestForNotAddingToken = [
        'product',
        'product-category',
        'states',
        'countries'
    ];
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.isValidRequestForInterceptor(request) && this.isValidGetRequestForInterceptor(request)) {
      this.authenticationService.loadToken();
      const token = this.authenticationService.getToken();

      // inject token into headers
      const modifiedRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
      return next.handle(modifiedRequest);
    }

    return next.handle(request);
  }


  private isValidRequestForInterceptor(request: HttpRequest<unknown>): boolean {
    // http://localhost/api/user/login
    const positionIndicator = 'api/';
    const position = request.url.indexOf(positionIndicator);
    if (position > 0) {
      const destination = request.url.substr(position + positionIndicator.length);
      for (const address of this.validRequestForNotAddingToken) {
        if (new RegExp(address).test(destination)) {
          return false;
        }
      }
    }
    return true;
  }

  private isValidGetRequestForInterceptor(request: HttpRequest<unknown>): boolean {
    // http://localhost/api/user/login
    const positionIndicator = 'api/';
    const position = request.url.indexOf(positionIndicator);
    if (position > 0) {
      const destination = request.url.substr(position + positionIndicator.length);
      for (const address of this.validGetRequestForNotAddingToken) {
        if (new RegExp(address).test(destination) && request.method === 'GET') {
          return false;
        }
      }
    }
    return true;
  }
}
