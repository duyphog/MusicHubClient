import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../@model/custom-http-response.model';
import { environment } from './../../environments/environment';
import { AppUtilService } from './app-util.service';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  private baseUrl = environment.apiUrl;
  
  constructor(private httpClient: HttpClient) {}

  /**
   * 
   * @param path The path URL
   * @returns Observable: any
   */
  getRequest<T>(path: string): Observable<any> {
    try {
      return this.httpClient.get<T>(`${this.baseUrl}${path}`);  
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * 
   * @param path The path URL
   * @param data 
   * @returns `Observable: any`
   */
  postRequest<T>(path: string, data: any, options?: any): Observable<any> {
    try {
      return this.httpClient.post<T>(`${this.baseUrl}${path}`, data, options);  
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * 
   * @param path The path URL
   * @param data The data content
   * @returns Observable: any
   */
   putRequest<T>(path: string, data: any): Observable<any> {
    try {
      return this.httpClient.put<T>(`${this.baseUrl}${path}`, data);  
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * 
   * @param path The path URL
   * @returns Observable<any>
   */
   deleteRequest<T>(path: string): Observable<any> {
    try {
      return this.httpClient.delete<T>(`${this.baseUrl}${path}`);  
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
