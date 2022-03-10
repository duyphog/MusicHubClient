import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppUser } from '../@model/app-user.model';
import { Observable } from 'rxjs';
import { AppUtilService } from './app-util.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserInfo } from '../@model/user-info.model';
import { AppUserService } from 'src/app/@services/app-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends BaseService {
  private token: string;
  private path: string = '/user';
  private loggedInUsername: string;
  private loggedInAvatar: string;
  private jwtHelper = new JwtHelperService();

  constructor(httpClient: HttpClient, private appUtilService: AppUtilService, private userService: AppUserService) {
    super(httpClient);
  }

  public register(user: AppUser): Observable<AppUser> {
    return super.postRequest<AppUser>(`${this.path}/register`, user);
  }

  public login(user: AppUser): Observable<AppUser> {
    return super.postRequest<AppUser>(`${this.path}/login`, user);
  }

  public resetPassword(email: string): Observable<AppUser> {
    return super.postRequest<AppUser>(`${this.path}/reset-password/${email}`, email);
  }

  public saveToken(token: string): void {
    this.token = token;
    this.appUtilService.addToLocalCache('token', token);
  }

  public addUserInfoToLocalCache(user: UserInfo): void {
    this.appUtilService.addToLocalCache('user', user);
  }

  public getUserInfoFromLocalCache(): UserInfo {
    return this.appUtilService.getFromLocalCache('user');
  }

  public getToken(): string {
    return this.token;
  }

  public loadToken(): void {
    this.token = this.appUtilService.getFromLocalCache('token');
  }

  public isLoggedIn(): boolean {
    this.loadToken();
    if (this.token !== null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub !== null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          this.loggedInAvatar = this.getUserInfoFromLocalCache()?.avatarImg;
          return true;
        }
      }
    }
    this.logOut();
    return false;
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    this.appUtilService.removeFromLocalCache('user');
    this.appUtilService.removeFromLocalCache('token');
    this.appUtilService.removeFromLocalCache('trackLiked');
  }

  checkRole(roleToCheck: string): boolean {
    this.loadToken();
    return (this.jwtHelper.decodeToken(this.token).authorities as Array<string>).indexOf(roleToCheck) !== -1;
  }

  roleMatch(allowedRole: Array<string>): boolean {
    this.loadToken();
    let isMatch = false;
    const userRoles = this.jwtHelper.decodeToken(this.token).authorities as Array<string>;
    allowedRole.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
      }
    });
    return isMatch;
  }

  public getLoggedInUsername(): string {
    return this.loggedInUsername;
  }

  public getLoggedInAvatar(): string {
    return this.loggedInAvatar;
  }
}
