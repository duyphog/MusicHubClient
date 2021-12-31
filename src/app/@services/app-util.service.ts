import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/@services/base.service';
import { CustomHttpResponse } from '../@model/custom-http-response';
import { AppConstant } from '../@constant/app-constant';

@Injectable({
  providedIn: 'root'
})
export class AppUtilService extends BaseService{

  /**
   *
   * @param path The path URL
   * @returns `Observable: any`
   */
   get<T>(path: string): Observable<T> {
    return this.getRequest<T>(`${path}`);
  }

  /**
   * 
   * @param path
   * @param data 
   * @returns `Observable: any`
   */
  save<T>(path: string, data: any): Observable<any> {
    return this.postRequest<T>(`${path}`, data);
  }

  /**
   * 
   * @param path
   * @param data 
   * @returns `Observable: any`
   */
   update<T>(path: string, data: any): Observable<any> {
    return this.putRequest<T>(`${path}`, data);
  }

  /**
   * 
   * @param path 
   * @param id 
   * @returns `Observable`
   */
  delete<T>(path: string): Observable<CustomHttpResponse> {
    return this.deleteRequest<T>(`${path}`)
  }

  /**
   * 
   * @param name 
   * @param items 
   */
  addToLocalCache(name: string, items: any): void {
    localStorage.setItem(`${AppConstant.APP_PREFIX}_${name}`, JSON.stringify(items));
  }
  
  /**
   * 
   * @param name 
   * @returns `T[]`
   */
  getFromLocalCache(name: string): any {
    if (localStorage.getItem(`${AppConstant.APP_PREFIX}_${name}`)) {
      return JSON.parse(localStorage.getItem(`${AppConstant.APP_PREFIX}_${name}`));
    }
    return null;
  }

  /**
   * 
   * @param name 
   */
  removeFromLocalCache(name: string): void {
    localStorage.removeItem(`${AppConstant.APP_PREFIX}_${name}`);
  }

  /**
   * @param formData
   */
  convertFormDataToJSON(formData: FormData): any {
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    return JSON.parse(JSON.stringify(object));
  }
}
