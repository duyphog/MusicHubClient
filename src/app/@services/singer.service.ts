import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/@services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../@model/artist.model';

@Injectable({
  providedIn: 'root'
})
export class SingerService extends BaseService{

  path: string = "/singer";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getSinger(id: number): Observable<Artist> {
    return this.getRequest<Artist>(`${this.path}/${id}`);
  }

  getAlbumsBySinger(id: number, pageNumber: number, pageSize: number): Observable<any> {
    return this.getRequest<any>(`${this.path}/${id}/albums?page-number=${pageNumber}&page-size=${pageSize}`);
  }

  getTracksBySinger(id: number, pageNumber: number, pageSize: number): Observable<any> {
    return this.getRequest<any>(`${this.path}/${id}/tracks?page-number=${pageNumber}&page-size=${pageSize}`);
  }
}
