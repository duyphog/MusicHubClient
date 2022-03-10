import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { AppUtilService } from './app-util.service';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../@model/app-user.model';
import { UserInfo } from '../@model/user-info.model';
import { ChangePassword } from '../@model/change-password.model';
import { UserWhiteList } from '../@model/user-white-list.model';

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
    return this.getRequest<UserInfo>(`${this.path}/profiles?id=${id}`);
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

  public updateWhiteList(userWhiteList: UserWhiteList): Observable<any> {
    return this.putRequest<any>(`${this.path}/white-list`, userWhiteList);
  }

  public getTrackLiked(): Observable<any> {
    return this.getRequest<any>(`${this.path}/track-liked`);
  }

  public getWhiteList(): Observable<any> {
    return this.getRequest<any>(`${this.path}/white-list`);
  }

  public addTrackLikedToLocalCache(trackLiked: number[]) {
    this.appUtilService.addToLocalCache('trackLiked', trackLiked);
  }

  public getTrackLikedFromLocalCache(): number[] {
    return this.appUtilService.getFromLocalCache('trackLiked');
  }

  public updateTrackLikedFromLocalCache(userWhiteList: UserWhiteList) {
    const trackLikedList: number[] = this.appUtilService.getFromLocalCache('trackLiked');
    if (trackLikedList) {
      if (this.checkExistTrackInTrackLikedList(userWhiteList.trackId)) {
        if (!userWhiteList.isAdd) {
          trackLikedList.splice(trackLikedList.indexOf(userWhiteList.trackId), 1);
        }
      } else {
        if (userWhiteList.isAdd) {
          trackLikedList.push(userWhiteList.trackId);
        }
      }
    }
      
    this.addTrackLikedToLocalCache(trackLikedList);
  }

  public checkExistTrackInTrackLikedList(trackId: number): boolean {
    const trackLikedList = this.getTrackLikedFromLocalCache();
    if (trackLikedList) {
      for (let i = 0; i < trackLikedList.length; i++) {
        if (trackLikedList[i] === trackId) {
          return true;
        }
      }
    }
    
    return false;
  }
}
