import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/@services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../@model/category';
import { Artist } from './../@model/artist';
import { Genre } from '../@model/genre';

@Injectable({
  providedIn: 'root'
})
export class CommonService extends BaseService {

  path: string = '/common';

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  listCategory(): Observable<Category[]> {
    return this.getRequest<Category[]>(`${this.path}/category`);
  }

  listGenre(): Observable<Genre[]> {
    return this.getRequest<Genre[]>(`${this.path}/genre`);
  }

  listSinger(name: string): Observable<any> {
    return this.getRequest<any>(`${this.path}/search-singer?search=${name}`);
  }

  listComposer(name: string): Observable<any> {
    return this.getRequest<any>(`${this.path}/search-composer?search=${name}`);
  }
}
