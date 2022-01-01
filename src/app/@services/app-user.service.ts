import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { AppUtilService } from './app-util.service';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../@model/app-user';
import { UserInfo } from './../@model/user-info';
import { ChangePassword } from './../@model/change-password';

@Injectable({
  providedIn: 'root',
})
export class AppUserService extends BaseService {
  path: string = '/user';

  constructor(httpClient: HttpClient, private appUtilService: AppUtilService) {
    super(httpClient);
  }

  public updateUser(formData: any): Observable<UserInfo> {
    return this.appUtilService.update<UserInfo>(`${this.path}/profiles`, formData);
  }

  public getUserInfo(id: number): Observable<UserInfo> {
    return this.getRequest<UserInfo>(`${this.path}/profiles?userId=${id}`);
  }

  public createUserFormData(
    userId: number,
    loggedInUsername: string,
    user: UserInfo
  ): FormData {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('username', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('story', user.story);
    return formData;
  }

  public updateProfileImage(
    formData: FormData
  ): Observable<HttpEvent<UserInfo>> {
    return this.postRequest<UserInfo>(`${this.path}/upload-profile-image`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public changePassword(data: ChangePassword) {
    return this.putRequest<ChangePassword>(`${this.path}/password`, data);
  }
}
