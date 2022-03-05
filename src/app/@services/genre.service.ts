import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../@model/genre.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService extends BaseService {


  path: string = "/genre";

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  listGenre(): Observable<Genre[]> {
    return this.getRequest<Genre[]>(`${this.path}`);
  }
}
